import { motion } from 'framer-motion';

export const Gallery = ({ items, loading, onImageClick }: any) => {
  const startDate = items.length > 0 ? items[items.length - 1].date.replace(/-/g, '.') : "...";
  const endDate = items.length > 0 ? items[0].date.replace(/-/g, '.') : "...";

  const SkeletonCard = ({ index }: { index: number }) => (
    <div 
      className="relative break-inside-avoid mb-4 overflow-hidden bg-zinc-900/40 rounded-sm border border-white/5"
      style={{ height: index % 2 === 0 ? '320px' : '450px' }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 space-y-3">
        <div className="h-2 w-16 bg-white/10 rounded-full" />
        <div className="h-4 w-3/4 bg-white/10 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-4 sm:px-10">
      <header className="mb-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-white/30" />
            <p className="text-[10px] tracking-[0.2em] uppercase ">Interstellar Discoveries</p>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extralight tracking-tighter uppercase italic">
            Cosmic <span className="text-white/40 font-normal not-italic">Images</span>
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-wide uppercase text-white">Range</span>
              <span className="text-xs tracking-wide text-white/80">
                {loading ? "Loading..." : `${endDate} - ${startDate}`}
              </span>
            </div>
          </div>
        </motion.div>
      </header>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)
        ) : (
          items.map((item: any, index: number) => (
            <motion.div
              key={item.date}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              onClick={() => onImageClick(index)}
              className="relative break-inside-avoid mb-4 overflow-hidden cursor-pointer group bg-zinc-900 rounded-sm border border-white/5"
            >
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 brightness-[0.85] group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                <p className="text-[9px] font-semibold tracking-wide text-white mb-2 uppercase">
                  {item.date.replace(/-/g, '.')}
                </p>
                <h3 className="text-base font-light leading-tight uppercase italic max-w-[90%] tracking-tight line-clamp-2">
                  {item.title}
                </h3>
                <div className="h-px w-0 hidden sm:inline group-hover:w-full bg-white/40 transition-all duration-700 mt-4" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
