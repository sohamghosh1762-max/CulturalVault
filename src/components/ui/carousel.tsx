import * as React from "react";

export type CarouselApi = {
  scrollSnapList: () => number[];
  selectedScrollSnap: () => number;
  on: (event: string, callback: () => void) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
};

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  setApi?: (api: CarouselApi) => void;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ setApi, children, className, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    
    // Find the CarouselContent child to calculate total items
    const contentChild = React.Children.toArray(children).find(
      (child: any) => child.type === CarouselContent
    ) as any;
    
    const count = contentChild ? React.Children.count(contentChild.props.children) : 0;

    const listeners = React.useRef<Record<string, (() => void)[]>>({});

    const trigger = React.useCallback((event: string) => {
      if (listeners.current[event]) {
        listeners.current[event].forEach((cb) => cb());
      }
    }, []);

    const api = React.useMemo<CarouselApi>(() => {
      return {
        scrollSnapList: () => Array.from({ length: count }, (_, i) => i),
        selectedScrollSnap: () => activeIndex,
        on: (event, callback) => {
          if (!listeners.current[event]) {
            listeners.current[event] = [];
          }
          listeners.current[event].push(callback);
        },
        scrollPrev: () => {
          setActiveIndex((prev) => {
            const next = prev > 0 ? prev - 1 : prev;
            setTimeout(() => trigger("select"), 0);
            return next;
          });
        },
        scrollNext: () => {
          setActiveIndex((prev) => {
            const next = prev < count - 1 ? prev + 1 : prev;
            setTimeout(() => trigger("select"), 0);
            return next;
          });
        },
      };
    }, [count, activeIndex, trigger]);

    React.useEffect(() => {
      if (setApi) {
        setApi(api);
      }
    }, [setApi, api]);

    return (
      <div ref={ref} className={className} {...props}>
        {React.Children.map(children, (child: any) => {
          if (child && child.type === CarouselContent) {
            return React.cloneElement(child, { activeIndex });
          }
          return child;
        })}
      </div>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { activeIndex?: number }
>(({ className, activeIndex = 0, children, ...props }, ref) => {
  return (
    <div ref={ref} className="overflow-hidden w-full" {...props}>
      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {children}
      </div>
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full shrink-0 grow-0 basis-full"
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

export { Carousel, CarouselContent, CarouselItem };
