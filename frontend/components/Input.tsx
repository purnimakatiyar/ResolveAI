export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}
