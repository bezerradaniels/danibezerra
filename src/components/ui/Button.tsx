import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type BaseProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  as?: 'button'
  className?: string
  clickId?: string
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button'
  }

type ButtonAsAnchor = Omit<BaseProps, 'as'> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a'
  }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantClasses = {
  primary:
    'bg-[#14CC45] text-white hover:bg-[#12B83E] focus-visible:outline-[#14CC45] shadow-lg shadow-[#14CC45]/20',
  secondary:
    'bg-white text-slate-800 hover:bg-slate-50 focus-visible:outline-slate-300 border border-slate-200',
  ghost: 'bg-transparent text-slate-600 hover:text-slate-900 focus-visible:outline-slate-300',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as = 'button',
  className,
  clickId,
  ...rest
}: ButtonProps) {
  const Component = as === 'a' ? 'a' : 'button'
  const composedClassName = [
    'inline-flex cursor-pointer items-center justify-center rounded-full font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component
      id={clickId}
      data-click-id={clickId}
      className={composedClassName}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Component>
  )
}
