interface ChecklistProps {
  items: string[];
  title?: string;
}

export function Checklist({ items, title }: ChecklistProps) {
  return (
    <div className="space-y-3">
      {title && <p className="text-sm font-medium text-foreground">{title}</p>}
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 h-4 w-4 rounded border border-border bg-white"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
