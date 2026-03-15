import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NeonButton } from './ui/NeonButton';
import { useAddBot } from '@/hooks/use-bots';
import { useToast } from '@/hooks/use-toast';

const botSchema = z.object({
  clientId: z.string().min(15, "ID de cliente inválido").max(20, "ID de cliente inválido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50),
  description: z.string().min(10, "Añade una descripción más larga").max(500),
  prefix: z.string().optional(),
  avatarUrl: z.string().url("URL de avatar inválida").optional().or(z.literal('')),
  tagsString: z.string().min(2, "Añade al menos una etiqueta (separadas por coma)"),
});

type BotFormValues = z.infer<typeof botSchema>;

export function AddBotForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const addBotMutation = useAddBot();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BotFormValues>({
    resolver: zodResolver(botSchema),
  });

  const onSubmit = async (data: BotFormValues) => {
    try {
      const tags = data.tagsString.split(',').map(t => t.trim()).filter(Boolean);
      
      await addBotMutation.mutateAsync({
        data: {
          clientId: data.clientId,
          name: data.name,
          description: data.description,
          prefix: data.prefix || undefined,
          avatarUrl: data.avatarUrl || undefined,
          tags,
          featured: false
        }
      });
      
      toast({
        title: "¡Bot añadido!",
        description: "Tu bot ha sido registrado exitosamente en la red.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error de Sistema",
        description: error.message || "No se pudo añadir el bot.",
        variant: "destructive"
      });
    }
  };

  const inputClasses = "w-full bg-black/50 border border-white/20 rounded-md px-4 py-3 text-white font-body focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-300 placeholder:text-gray-500";
  const labelClasses = "block text-sm font-display tracking-widest text-gray-300 mb-1.5 uppercase";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={labelClasses}>ID del Cliente (Client ID)</label>
        <input 
          {...register('clientId')} 
          className={inputClasses}
          placeholder="Ej: 123456789012345678"
        />
        {errors.clientId && <p className="text-neon-pink text-xs mt-1 mt-1">{errors.clientId.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>Nombre del Bot</label>
          <input 
            {...register('name')} 
            className={inputClasses}
            placeholder="Ej: CyberBot"
          />
          {errors.name && <p className="text-neon-pink text-xs mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className={labelClasses}>Prefijo</label>
          <input 
            {...register('prefix')} 
            className={inputClasses}
            placeholder="Ej: ! o /"
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Descripción Corta</label>
        <textarea 
          {...register('description')} 
          className={`${inputClasses} resize-none h-24`}
          placeholder="¿Qué hace tu bot? Describe sus mejores funciones..."
        />
        {errors.description && <p className="text-neon-pink text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className={labelClasses}>Etiquetas (separadas por coma)</label>
        <input 
          {...register('tagsString')} 
          className={inputClasses}
          placeholder="Moderación, Música, Economía..."
        />
        {errors.tagsString && <p className="text-neon-pink text-xs mt-1">{errors.tagsString.message}</p>}
      </div>
      
      <div>
        <label className={labelClasses}>URL del Avatar (Opcional)</label>
        <input 
          {...register('avatarUrl')} 
          className={inputClasses}
          placeholder="https://..."
        />
        {errors.avatarUrl && <p className="text-neon-pink text-xs mt-1">{errors.avatarUrl.message}</p>}
      </div>

      <div className="pt-4 flex justify-end">
        <NeonButton 
          type="submit" 
          variant="cyan" 
          isLoading={isSubmitting || addBotMutation.isPending}
          className="w-full sm:w-auto"
        >
          Inicializar Bot
        </NeonButton>
      </div>
    </form>
  );
}
