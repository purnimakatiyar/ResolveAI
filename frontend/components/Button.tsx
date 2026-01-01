export default function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-lg bg-purple-600 py-3 text-white font-medium
                 hover:bg-purple-700 transition disabled:opacity-50"
    >
      {children}
    </button>
  );
}
