import React from 'react';
import { motion } from 'framer-motion';
import { Server, ThumbsUp, ChevronRight } from 'lucide-react';
import { type Bot } from '@workspace/api-client-react';
import { NeonButton } from './ui/NeonButton';
import { useVoteForBot } from '@/hooks/use-bots';
import { useToast } from '@/hooks/use-toast';

interface BotCardProps {
  bot: Bot;
  index: number;
}

export function BotCard({ bot, index }: BotCardProps) {
  const { toast } = useToast();
  const voteMutation = useVoteForBot();
  const defaultAvatar = `${import.meta.env.BASE_URL}images/default-avatar.png`;

  const handleVote = async () => {
    try {
      await voteMutation.mutateAsync({ id: bot.id });
      toast({
        title: "¡Voto registrado!",
        description: `Has votado por ${bot.name}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el voto en este momento.",
        variant: "destructive"
      });
    }
  };

  const inviteUrl = bot.inviteUrl || `https://discord.com/api/oauth2/authorize?client_id=${bot.clientId}&permissions=8&scope=bot%20applications.commands`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative glass-panel rounded-xl p-5 hover:neon-border-cyan transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* Decorative corner pieces */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 group-hover:border-neon-cyan transition-colors" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20 group-hover:border-neon-cyan transition-colors" />

      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/10 group-hover:border-neon-cyan transition-all duration-300 bg-black/50">
            <img 
              src={bot.avatarUrl || defaultAvatar} 
              alt={`${bot.name} avatar`}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = defaultAvatar; }}
            />
          </div>
          {/* Subtle glow behind avatar */}
          <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-display font-bold text-white truncate group-hover:text-neon-cyan transition-colors duration-300">
            {bot.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-400 mt-1 font-body">
            <span className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/5">
              <Server className="w-3.5 h-3.5 text-neon-purple" />
              {bot.servers.toLocaleString()}
            </span>
            {bot.prefix && (
              <span className="bg-black/40 px-2 py-0.5 rounded border border-white/5 font-mono text-xs text-neon-pink">
                {bot.prefix}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-5 line-clamp-3 leading-relaxed flex-1 z-10">
        {bot.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6 z-10">
        {bot.tags.slice(0, 3).map((tag, i) => (
          <span 
            key={i} 
            className="text-[10px] font-display uppercase tracking-wider px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-gray-300 group-hover:border-neon-cyan/30 transition-colors"
          >
            {tag}
          </span>
        ))}
        {bot.tags.length > 3 && (
          <span className="text-[10px] font-display px-2 py-1 text-gray-500">+{bot.tags.length - 3}</span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-auto z-10 pt-4 border-t border-white/5">
        <button
          onClick={handleVote}
          disabled={voteMutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded bg-white/5 hover:bg-neon-pink/20 border border-transparent hover:border-neon-pink/50 text-gray-300 hover:text-neon-pink transition-all duration-300 font-display text-sm tracking-wide disabled:opacity-50"
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="font-bold">{bot.votes}</span> VOTOS
        </button>
        
        <a 
          href={inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 relative group/btn"
        >
          <div className="absolute inset-0 bg-neon-cyan opacity-0 group-hover/btn:opacity-20 blur-md transition-opacity rounded-sm" />
          <div className="relative flex items-center justify-center gap-1 py-2 rounded-sm border border-neon-cyan text-neon-cyan font-display font-bold text-sm tracking-widest uppercase hover:bg-neon-cyan hover:text-black transition-all duration-300">
            Invitar <ChevronRight className="w-4 h-4" />
          </div>
        </a>
      </div>
    </motion.div>
  );
}
