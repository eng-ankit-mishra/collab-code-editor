import Button from "../../../components/ui/Button.tsx";


export default function SettingItem({
  title,
  description,
  actionLabel,
  danger = false,
  settingFunction
}: {
  title: string;
  description: string;
  actionLabel: string;
  danger?: boolean;
  settingFunction: ()=> void
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900 border border-white/5">
      <div>
        <h3 className="text-sm font-medium text-white">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          {description}
        </p>
      </div>

      <Button
        isTransparent
        className={
          danger
            ? "text-red-500 border-red-500 hover:bg-red-500/10"
            : ""
        }
        onClick={settingFunction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}