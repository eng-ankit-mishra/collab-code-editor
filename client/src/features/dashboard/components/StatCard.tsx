import CountUp from "react-countup";

export default function StatCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="bg-neutral-900 border border-white/5 rounded-lg p-4">
      <div className="text-3xl font-semibold text-white">
        <CountUp
          end={value}
          duration={3}
          separator=","
          preserveValue
        />
      </div>

      <p className="text-sm text-zinc-400 mt-1">
        {label}
      </p>
    </div>
  );
}
