
import React from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, BookOpen, Droplets, Info, ExternalLink, Scissors } from 'lucide-react';

const RecipesPage: React.FC = () => {
  const { products } = useApp();

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green font-serif text-shadow-sm">Shot Recipes</h1>
        <p className="text-brand-brown mt-2 max-w-2xl mx-auto font-medium">
          Official production guidelines for the Living Water fundraiser.
        </p>
      </div>

      <div className="bg-brand-orange/5 border-l-4 border-brand-orange p-5 rounded-r-xl flex gap-4 items-start max-w-3xl mx-auto shadow-sm">
        <Info className="text-brand-orange flex-shrink-0 mt-1" size={24} />
        <div>
            <h4 className="font-bold text-brand-brown">General Production Note</h4>
            <p className="text-sm text-brand-brown/80 mt-1 leading-relaxed">
                Wash all produce thoroughly. Cold-press for maximum nutrient retention. Strain all juices through a fine-mesh sieve to ensure a smooth texture. Bottling should happen immediately after juicing. Keep refrigerated.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {products.map(product => {
          /**
           * FIXED: Local Video Implementation
           * Using tutorial.mp4 with Media Fragments (#t=start,end)
           * This completely bypasses YouTube's Error 153.
           */
          const startTime = product.videoStart ?? 0;
          const endTime = product.videoEnd ?? 0;
          
          // Media Fragment URI: starting and ending at specific timestamps
          const videoSrc = `./tutorial.mp4#t=${startTime},${endTime}`;

          return (
            <div key={product.id} className="bg-white rounded-3xl shadow-xl border border-brand-light-green/20 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:border-brand-light-green/40">
              <div className="bg-brand-green p-5 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                      <Droplets className="text-brand-orange" size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-white font-serif tracking-tight">{product.name}</h3>
                </div>
                <BookOpen className="text-brand-light-green/40" size={20} />
              </div>
              
              <div className="p-6 flex-grow space-y-6">
                {/* Tutorial Video Segment */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-extrabold text-brand-brown/60 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Scissors size={14} className="text-brand-orange" /> Recipe Snippet
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-brand-green/5 text-brand-green px-2.5 py-1 rounded-full font-bold border border-brand-green/10 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                          {Math.floor(startTime / 60)}:{(startTime % 60).toString().padStart(2, '0')} - {Math.floor(endTime / 60)}:{(endTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-brand-cream/30 bg-black shadow-inner">
                    <video 
                      key={videoSrc} // Key forces reload when segment changes
                      className="absolute inset-0 w-full h-full object-cover"
                      controls
                      preload="metadata"
                      playsInline
                    >
                      <source src={videoSrc} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <p className="text-[9px] text-gray-400 text-center italic">
                    Local High-Quality Tutorial Snippet
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="text-[10px] font-extrabold text-brand-brown/60 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Utensils size={14} className="text-brand-orange" /> Essential Ingredients
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.ingredients.map((ingredient, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-700 bg-brand-cream/10 p-3 rounded-xl border border-brand-cream/20 hover:bg-brand-cream/20 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-brand-light-green shrink-0" />
                        <span className="font-medium">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Benefit Profile</p>
                  <p className="text-sm text-brand-brown/80 leading-relaxed italic">
                      {product.description}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-brand-cream/10 border-t border-brand-light-green/10 flex justify-between items-center">
                  <a 
                    href="https://feelinfabulouswithkayla.com/2022/11/06/immune-boosting-wellness-shots/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-brand-green font-bold hover:text-brand-orange transition-colors flex items-center gap-1.5 uppercase tracking-wide"
                  >
                    Source Documentation <ExternalLink size={12} />
                  </a>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                    <p className="text-[10px] text-brand-brown/50 uppercase font-extrabold tracking-tighter">Living Water QA Verified</p>
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipesPage;
