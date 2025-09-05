'use client'

import React from 'react'

interface TabConfig<T extends string> {
  id: T
  label: string | React.ReactNode
  mobileLabel?: string | React.ReactNode
}

interface TabsContainerProps<T extends string> {
  tabs: TabConfig<T>[]
  selectedTab: T | null
  indicatorStyle: {
    left: number
    width: number
    opacity?: number
  }
  refs: { [K in T]: React.RefObject<HTMLButtonElement | null> }
  onTabChange: (tab: T) => void
  rightContent?: React.ReactNode
}

export function TabsContainer<T extends string>({
  tabs,
  selectedTab,
  indicatorStyle,
  refs,
  onTabChange,
  rightContent,
}: TabsContainerProps<T>) {
  return (
    <div className="relative">
      <div className="flex flex-row items-center justify-between border-b border-white">
        <div className="flex flex-row gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              ref={refs[tab.id]}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 hover:cursor-pointer ${
                selectedTab === tab.id ? 'text-black' : 'text-black hover:bg-gray-100'
              }`}
            >
              {tab.mobileLabel ? (
                <>
                  <span className="block sm:hidden">{tab.mobileLabel}</span>
                  <span className="hidden sm:block">{tab.label}</span>
                </>
              ) : (
                tab.label
              )}
            </button>
          ))}
        </div>
        {rightContent}
        <div
          className="absolute bottom-[-1px] h-[2px] bg-orange-500 transition-all duration-200"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity ?? 1,
          }}
        />
      </div>
    </div>
  )
}

export type { TabConfig }
