interface ListToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  primarySelect?: {
    value: string
    onChange: (value: string) => void
    options: Array<{ label: string; value: string }>
  }
  secondaryInput?: {
    value: string
    onChange: (value: string) => void
    placeholder: string
  }
}

export function ListToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  primarySelect,
  secondaryInput,
}: ListToolbarProps) {
  return (
    <div className="mb-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_220px_220px]">
      <input
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        placeholder={searchPlaceholder}
      />
      {primarySelect ? (
        <select
          value={primarySelect.value}
          onChange={(event) => primarySelect.onChange(event.target.value)}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {primarySelect.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {secondaryInput ? (
        <input
          value={secondaryInput.value}
          onChange={(event) => secondaryInput.onChange(event.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          placeholder={secondaryInput.placeholder}
        />
      ) : null}
    </div>
  )
}
