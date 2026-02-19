import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-full mx-auto p-8 text-center justify-center" >
      <div className="flex row justify-center">
        <a
          href="https://vite.dev"
          target="_blank"
          className="font-medium text-[#646cff] no-underline hover:text-[#535bf2]"
        >
          <img
            src={viteLogo}
            className="logo h-24 p-6 [will-change:filter] transition-[filter] duration-300 hover:[filter:drop-shadow(0_0_2em_#646cffaa)]"
            alt="Vite logo"
          />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          className="font-medium text-[#646cff] no-underline hover:text-[#535bf2]"
        >
          <img
            src={reactLogo}
            className="logo react h-24 p-6 [will-change:filter] transition-[filter] duration-300 hover:[filter:drop-shadow(0_0_2em_#61dafbaa)]"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-[3.2em] leading-[1.1]">Vite + React</h1>
      <div className="p-8">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg border border-transparent px-[1.2em] py-[0.6em] text-base font-medium font-[inherit] bg-[#1a1a1a] cursor-pointer transition-[border-color] duration-300 hover:border-[#646cff] focus:outline-none focus-visible:outline-4 focus-visible:outline-auto"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-[#888]">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
