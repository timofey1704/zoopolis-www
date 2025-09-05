'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

interface TabIndicatorStyle {
  left: number
  width: number
  opacity?: number
}

interface UseTabsOptions<T extends string> {
  defaultTab?: T | null
  allowDeselect?: boolean
  onTabChange?: (tab: T) => void
}

export function useTabs<T extends string>(tabs: T[], options: UseTabsOptions<T> = {}) {
  const { defaultTab = null, allowDeselect = false, onTabChange } = options

  const [selectedTab, setSelectedTab] = useState<T | null>(defaultTab)
  const [indicatorStyle, setIndicatorStyle] = useState<TabIndicatorStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  })

  // cоздаем ref для хранения всех refs табов
  const refsRef = useRef<{ [key: string]: React.RefObject<HTMLButtonElement | null> } | null>(null)

  // инициализируем refs только!!! при первом рендере
  if (!refsRef.current) {
    refsRef.current = {}
    tabs.forEach(tab => {
      refsRef.current![tab] = { current: null }
    })
  }

  // создаем стабильный объект refs для использования в компоненте
  const refs = useMemo(
    () => refsRef.current as { [K in T]: React.RefObject<HTMLButtonElement | null> },
    [] // пустой массив зависимостей, так как мы всегда используем одну и ту же!! ссылку на объект
  )

  const updateIndicator = useCallback(() => {
    if (!selectedTab) {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
      return
    }

    const activeRef = refs[selectedTab]

    if (activeRef?.current) {
      setIndicatorStyle({
        left: activeRef.current.offsetLeft,
        width: activeRef.current.offsetWidth,
        opacity: 1,
      })
    }
  }, [selectedTab, refs])

  useEffect(() => {
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  const handleTabChange = (tab: T) => {
    const newTab = allowDeselect && tab === selectedTab ? null : tab
    setSelectedTab(newTab)
    if (newTab !== null && onTabChange) {
      onTabChange(newTab)
    }
  }

  return {
    selectedTab,
    indicatorStyle,
    refs,
    handleTabChange,
  }
}
