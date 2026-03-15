import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Plus, Search, Github, Mail, Heart } from 'lucide-react';
import { useBots } from '@/hooks/use-bots';
import { ParticleBackground } from '@/components/ParticleBackground';
import { BotCard } from '@/components/BotCard';
import { FeaturedBot } from '@/components/FeaturedBot';
import { Modal } from '@/components/ui/Modal';
import { AddBotForm } from '@/components/AddBotForm';
import { NeonButton } from '@/components/ui/NeonButton';

export default function Home() {
  const { data: bots, isLoading, error } = useBots();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const featuredBot = bots?.find(b => b.featured) || (bots && bots.length > 0 ? bots[0] : null);
  
  const filteredBots = bots?.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bot.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded border border-neon-cyan flex items-center justify-center bg-neon-cyan/10 shadow-[0_0_10px_rgba(0,255,255,0.3)]">
              <Terminal className="w-6 h-6 text-neon-cyan" />
            </div>
            <span className="font-display font-bold text-xl tracking-widest text-white hidden sm:block">
              CYBER<span className="text-neon-cyan">BOTS</span>
            </span>
          </div>
          
          <NeonButton 
            variant="cyan" 
            className="py-2 text-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Bot
          </NeonButton>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Hero Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight"
          >
            DISCORD <span className="text-gradient-rainbow">BOT LIST</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-body leading-relaxed"
          >
            El directorio definitivo de bots para Discord. Encuentra bots de <span className="text-neon-cyan">moderación</span>, <span className="text-neon-pink">música</span>, <span className="text-neon-purple">juegos</span> y utilidades para llevar tu servidor al siguiente nivel. Añade tu propio bot y compártelo con miles de comunidades.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-t-4 border-neon-cyan animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-4 border-neon-pink animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-4 rounded-full border-b-4 border-neon-purple animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center rounded-xl border-neon-pink/50 max-w-2xl mx-auto">
            <h3 className="text-neon-pink font-display text-2xl mb-2">Fallo en el Sistema</h3>
            <p className="text-gray-300">No se pudo conectar a la base de datos de bots. Reintentando conexión...</p>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {featuredBot && (
              <div className="mb-20">
                <FeaturedBot bot={featuredBot} />
              </div>
            )}

            {/* Grid Section */}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-display font-bold flex items-center gap-3">
                  <span className="w-2 h-8 bg-neon-cyan rounded-full inline-block shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                  EXPLORAR RED
                </h2>
                
                <div className="relative w-full md:w-64 group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-sm leading-5 bg-black/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan sm:text-sm transition-all duration-300"
                    placeholder="Buscar módulos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredBots.length === 0 ? (
                <div className="py-20 text-center text-gray-500 font-display tracking-widest uppercase">
                  No se encontraron resultados en los sectores de búsqueda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBots.map((bot, idx) => (
                    <BotCard key={bot.id} bot={bot} index={idx} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Add Bot Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="NUEVO REGISTRO"
      >
        <AddBotForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/60 backdrop-blur-md mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded border border-neon-cyan flex items-center justify-center bg-neon-cyan/10 shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                  <Terminal className="w-5 h-5 text-neon-cyan" />
                </div>
                <span className="font-display font-bold text-xl tracking-widest text-white">
                  CYBER<span className="text-neon-cyan">BOTS</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-body">
                El directorio de bots de Discord más completo en español. Descubre, añade y vota los mejores bots para tu comunidad.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-display text-sm tracking-widest text-neon-cyan mb-4 uppercase">Navegación</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-body">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-neon-cyan transition-colors">Inicio</button></li>
                <li><button onClick={() => setIsAddModalOpen(true)} className="hover:text-neon-pink transition-colors">Añadir tu Bot</button></li>
                <li><a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="hover:text-neon-purple transition-colors">Discord Developers</a></li>
              </ul>
            </div>

            {/* Creator */}
            <div>
              <h4 className="font-display text-sm tracking-widest text-neon-pink mb-4 uppercase">Creador</h4>
              <div className="space-y-3">
                <p className="text-white font-display font-bold text-lg tracking-wide">LzSunshiNe</p>
                <a
                  href="mailto:solweywolfmusic@gmail.com"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon-cyan transition-colors group"
                >
                  <Mail className="w-4 h-4 text-neon-cyan group-hover:drop-shadow-[0_0_6px_#00ffff]" />
                  solweywolfmusic@gmail.com
                </a>
                <a
                  href="https://github.com/DressHardstyle19"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon-purple transition-colors group"
                >
                  <Github className="w-4 h-4 text-neon-purple group-hover:drop-shadow-[0_0_6px_#8800ff]" />
                  @DressHardstyle19
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 font-body">
            <span>© {new Date().getFullYear()} CyberBots — Todos los derechos reservados</span>
            <span className="flex items-center gap-1.5">
              Hecho con <Heart className="w-3 h-3 text-neon-pink fill-neon-pink" /> por <span className="text-neon-pink">LzSunshiNe</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
