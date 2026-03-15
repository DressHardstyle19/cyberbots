import React from 'react';
import { motion } from 'framer-motion';
import { Server, ThumbsUp, Zap, ExternalLink } from 'lucide-react';
import { type Bot } from '@workspace/api-client-react';
import { NeonButton } from './ui/NeonButton';
import { useVoteForBot } from '@/hooks/use-bots';
import { useToast } from '@/hooks/use-toast';

export function FeaturedBot({ bot }: { bot: Bot }) {
  const { toast } = useToast();
  const voteMutation = useVoteForBot();
  const defaultAvatar = `${import.meta.env.BASE_URL}images/default-avatar.png`;

  const handleVote = async () => {
    try {
      await voteMutation.mutateAsync({ id: bot.id });
      toast({
        title: "¡Sobrecarga de energía!",
        description: `Voto especial registrado para ${bot.name}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el voto.",
        variant: "destructive"
      });
    }
  };

  const inviteUrl = bot.inviteUrl || `https://discord.com/api/oauth2/authorize?client_id=${bot.clientId}&permissions=8&scope=bot%20applications.commands`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative w-full rounded-2xl overflow-hidden glass-panel border border-neon-purple/50 p-1 md:p-1"
    >
      {/* Animated gradient border background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan opacity-20 animate-pulse-slow" />
      
      <div className="relative bg-black/80 backdrop-blur-xl rounded-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start z-10">
        
        {/* Featured Badge */}
        <div className="absolute top-0 right-0 md:top-4 md:right-4 bg-gradient-to-r from-neon-pink to-neon-purple px-4 py-1 rounded-bl-xl md:rounded-full font-display text-xs font-bold tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,255,0.5)]">
          <Zap className="w-3 h-3 fill-current" />
          SISTEMA DESTACADO
        </div>

        {/* Avatar Container */}
        <div className="relative shrink-0 group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 rounded-full" />
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-white/20 z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src={bot.avatarUrl || defaultAvatar} 
              alt={bot.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = defaultAvatar; }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 neon-glow-text">
            {bot.name}
          </h2>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 font-display text-sm tracking-wider">
            <div className="flex items-center gap-2 text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-sm border border-neon-cyan/30">
              <Server className="w-4 h-4" />
              <span>{bot.servers.toLocaleString()} Servidores</span>
            </div>
            <div className="flex items-center gap-2 text-neon-pink bg-neon-pink/10 px-3 py-1.5 rounded-sm border border-neon-pink/30">
              <ThumbsUp className="w-4 h-4" />
              <span>{bot.votes.toLocaleString()} Votos</span>
            </div>
            {bot.prefix && (
              <div className="text-gray-400 bg-white/5 px-3 py-1.5 rounded-sm border border-white/10 font-mono">
                Prefijo: <span className="text-white">{bot.prefix}</span>
              </div>
            )}
          </div>

          <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-3xl">
            {bot.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
            {bot.tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-black/50 border border-white/10 rounded-full text-sm font-display text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <NeonButton variant="rainbow" className="w-full text-lg py-3 px-8 flex items-center justify-center gap-3">
                <ExternalLink className="w-5 h-5" />
                Invitar al Servidor
              </NeonButton>
            </a>
            <NeonButton 
              variant="pink" 
              onClick={handleVote} 
              isLoading={voteMutation.isPending}
              className="w-full sm:w-auto text-lg py-3 flex items-center justify-center gap-3"
            >
              <ThumbsUp className="w-5 h-5" />
              Votar
            </NeonButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
