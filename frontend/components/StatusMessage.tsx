interface StatusMessageProps {
  message: string | null
  type: "success" | "error" | "info"
}

export default function StatusMessage({ message, type }: StatusMessageProps) {
  if (!message) return null

  return (
    <div
      className={`mb-4 p-3 rounded ${type === "error" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}
    >
      {message}
    </div>
  )
}