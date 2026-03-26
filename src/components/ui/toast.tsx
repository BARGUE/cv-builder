import { toast } from "sonner"

const base =
  "flex items-center justify-start gap-3 w-[340px] rounded-[14px] px-4 py-3.5 border text-sm shadow-xl font-['Sora',sans-serif]"

const variants = {
  success: `${base} bg-[#0f1f14] text-[#e8faf0] border-[rgba(34,197,94,0.25)] [box-shadow:0_8px_32px_rgba(34,197,94,0.15)]`,
  error: `${base} bg-[#1f0f0f] text-[#fae8e8] border-[rgba(239,68,68,0.25)] [box-shadow:0_8px_32px_rgba(239,68,68,0.15)]`,
  info: `${base} bg-[#0f1620] text-[#e8f0fa] border-[rgba(59,130,246,0.25)] [box-shadow:0_8px_32px_rgba(59,130,246,0.12)]`,
  warning: `${base} bg-[#1e1507] text-[#faf3e8] border-[rgba(245,158,11,0.3)] [box-shadow:0_8px_32px_rgba(245,158,11,0.12)]`,
}

const icons = {
  success: { symbol: "✓", bg: "bg-[rgba(34,197,94,0.2)]", color: "text-[#4ade80]" },
  error: { symbol: "✕", bg: "bg-[rgba(239,68,68,0.2)]", color: "text-[#f87171]" },
  info: { symbol: "i", bg: "bg-[rgba(59,130,246,0.2)]", color: "text-[#60a5fa]" },
  warning: { symbol: "!", bg: "bg-[rgba(245,158,11,0.2)]", color: "text-[#fbbf24]" },
}

function CustomToast({
  id,
  type,
  title,
  description,
}: {
  id: string | number
  type: keyof typeof variants
  title: string
  description?: string
}) {
  const icon = icons[type]

  return (
    <div className={variants[type]}>
      <div className={`flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-[10px] font-bold ${icon.bg} ${icon.color}`}>
        {icon.symbol}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[13.5px] leading-snug">{title}</p>
        {description && (
          <p className="text-[12px] leading-relaxed opacity-75 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(id)}
        className="opacity-40 hover:opacity-90 transition-opacity text-base leading-none shrink-0 mt-0.5 bg-transparent border-none cursor-pointer text-inherit"
      >
        ×
      </button>
    </div>
  )
}

export const myToast = {
  success: (title: string, description?: string) =>
    toast.custom((t) => <CustomToast id={t} type="success" title={title} description={description} />),

  error: (title: string, description?: string) =>
    toast.custom((t) => <CustomToast id={t} type="error" title={title} description={description} />),

  info: (title: string, description?: string) =>
    toast.custom((t) => <CustomToast id={t} type="info" title={title} description={description} />),

  warning: (title: string, description?: string) =>
    toast.custom((t) => <CustomToast id={t} type="warning" title={title} description={description} />),
}