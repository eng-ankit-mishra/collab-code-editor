
type AvatarProps = {
  name: string;
  size?: number; // optional size (default 32px)
};

function stringToColor(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += (`00${value.toString(16)}`).slice(-2);
  }

  return color;
}

export default function Avatar({
  name,
  size = 32,
}: AvatarProps) {
  if (!name) return null;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      title={name}
      className="flex items-center justify-center rounded-full text-white font-bold select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: stringToColor(name),
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
}
