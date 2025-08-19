export function HeroSection() {
  return (
    <section className={'mx-auto max-w-7xl px-[32px] relative flex items-center justify-between pt-16 mb-12'}>
      <div className={'text-center w-full '}>
        <h1 className={'text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] text-foreground/80 tracking-[-1.6px] font-medium'}>
          Powerful design tools.
          <br />
          Simple pricing.
        </h1>
        <p className={'mt-6 text-[18px] leading-[27px] md:text-[20px] text-secondary-foreground/60 md:leading-[30px]'}>
          Plans for teams of every size — from start-up to enterprise.
        </p>
      </div>
    </section>
  );
}