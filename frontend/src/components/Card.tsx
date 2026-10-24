import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'compact' | 'cover';
  interactive?: boolean;
  as?: React.ElementType;
  children?: React.ReactNode;
}

export function Card({
  variant = 'default',
  interactive = false,
  as: Component = 'div',
  className = '',
  children,
  style,
  ...rest
}: CardProps) {
  const variantClass = variant === 'compact' ? 'card-sm' : variant === 'cover' ? 'card card-cover' : 'card';
  const interactiveClass = interactive ? 'card-interactive' : '';
  const combinedClasses = `${variantClass} ${interactiveClass} ${className}`.trim();

  return (
    <Component className={combinedClasses} style={style} {...rest}>
      {children}
    </Component>
  );
}

export function CardHeader({
  className = '',
  children,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card-header ${className}`.trim()} style={style} {...rest}>
      {children}
    </div>
  );
}

export function CardBody({
  className = '',
  children,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`heroui-card-body break-words ${className}`.trim()} style={style} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card-footer ${className}`.trim()} style={style} {...rest}>
      {children}
    </div>
  );
}

export function CardRow({
  className = '',
  children,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card-row ${className}`.trim()} style={style} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({
  as: Component = 'h3',
  className = '',
  children,
  style,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }) {
  return (
    <Component
      className={`font-heading font-bold text-gray-900 leading-snug break-words ${className}`.trim()}
      style={{ color: '#111827', ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  className = '',
  children,
  style,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm leading-relaxed break-words ${className}`.trim()}
      style={{ color: '#6B7280', lineHeight: 1.5, ...style }}
      {...rest}
    >
      {children}
    </p>
  );
}

export function CardBadge({
  variant = 'blue',
  className = '',
  children,
  style,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'blue' | 'gray' | 'success' | 'amber' }) {
  const badgeColors = {
    blue: { background: 'rgba(29, 78, 216, 0.1)', color: '#1D4ED8', border: '1px solid rgba(29, 78, 216, 0.2)' },
    gray: { background: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB' },
    success: { background: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.2)' },
    amber: { background: 'rgba(245, 158, 11, 0.1)', color: '#D97706', border: '1px solid rgba(245, 158, 11, 0.2)' },
  };

  const current = badgeColors[variant] || badgeColors.blue;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${className}`.trim()}
      style={{ ...current, ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Card;
