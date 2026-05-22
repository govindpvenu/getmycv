export default function StatsSection() {
  return (
    <section id="benefits" className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-medium lg:text-5xl">
            Designed to keep momentum
          </h2>
          <p>
            GetMyCV removes the small bits of friction that slow candidates
            down after every role, referral, and recruiter message.
          </p>
        </div>

        <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          <div className="space-y-4">
            <div className="text-3xl font-bold">1 link</div>
            <p>Per CV version</p>
          </div>
          <div className="space-y-4">
            <div className="text-3xl font-bold">Anytime</div>
            <p>Document updates</p>
          </div>
          <div className="space-y-4">
            <div className="text-3xl font-bold">Live</div>
            <p>Recruiter view signals</p>
          </div>
        </div>
      </div>
    </section>
  );
}
