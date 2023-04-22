import { IconCopy } from '@tabler/icons-react'
import { Tag, Tooltip, Typography } from 'antd'
import type { TooltipPlacement } from 'antd/es/tooltip'
import copy from 'copy-to-clipboard'
import type { FC, ReactNode } from 'react'
import { useState, useCallback } from 'react'

export interface TextCopyProps {
  text?: string
  type?: 'link' | 'tag' | 'text'
  isIcon?: boolean
  tooltipPlacement?: TooltipPlacement
  hoverText?: ReactNode
  onCopy?: (text?: string) => void
  children?: ReactNode
}

const TagStyle = { borderRadius: '10px' }

export const TextCopy: FC<TextCopyProps> = ({
  text,
  children,
  onCopy: _onCopy,
  type = 'link',
  isIcon,
  tooltipPlacement,
  hoverText = false,
}) => {
  const [copied, setCopied] = useState<boolean>()

  const onCopy = useCallback(() => {
    if (text) {
      copy(text)
      _onCopy?.(text)
    } else {
      copy(text as string)
      _onCopy?.()
    }

    setCopied(true)
  }, [_onCopy, text])

  const onVisibleChange = useCallback((visible: boolean) => {
    if (!visible) {
      setTimeout(() => {
        setCopied(false)
      }, 100)
    }
  }, [])

  const isTag = type === 'tag'

  const TComponent =
    type === 'link' ? Typography.Link : type === 'text' ? Typography.Text : Tag

  const tipTitle = copied ? '已复制到剪切板' : '点击复制'

  return (
    <>
      <Tooltip
        title={hoverText || isTag ? text && `${text} ${tipTitle}` : tipTitle}
        placement={tooltipPlacement}
        onVisibleChange={onVisibleChange}
      >
        {isIcon ? (
          <TComponent>
            <IconCopy onClick={onCopy} />
          </TComponent>
        ) : (
          <TComponent
            style={isTag ? TagStyle : undefined}
            className="pointer"
            onClick={onCopy}
          >
            {children}
          </TComponent>
        )}
      </Tooltip>
    </>
  )
}
