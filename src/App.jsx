import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import DataTable from './components/DataTable';
import { BrowserRouter } from "react-router-dom";
// import './App.css'

function App() {
  return (
    <BrowserRouter basename="/CJR">
      <DataTable />
    </BrowserRouter>
  );
}

export default App
