# Process Scheduler (FCFS • RR • SJF • SRTF)

Interactive, educational CPU scheduling visualizer built with **React (JS)** and **SVG**.  
Simulate **FCFS**, **Round Robin**, **SJF (non-preemptive)**, and **SRTF (preemptive SJF)**.  
View a Gantt chart, tweak quantum, import/export CSV, and inspect key metrics.

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-blue)](https://amazingkid1998.github.io/Process-Scheduler/)
![Build](https://img.shields.io/github/actions/workflow/status/AmazingKid1998/Process-Scheduler/ci.yml?branch=main)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)

Repo: https://github.com/AmazingKid1998/Process-Scheduler

---

## ✨ Features
- Algorithms: **FCFS**, **RR (quantum)**, **SJF**, **SRTF**
- **SVG Gantt** timeline with tick labels
- **Metrics**: avg waiting / turnaround / response, CPU utilization, throughput
- **Import/Export CSV** (class-friendly)
- **Local persistence** (`localStorage`)
- Clean separation of **algorithm logic vs UI**

---

## 🎥 Demo (GIF)
> Add a 10–15s GIF at `public/demo.gif` (RR with quantum change looks great).

![Demo](public/demo.gif)

---

## 🛠️ Stack
- React + Vite (JavaScript)
- SVG for visualization
- Browser storage (localStorage)

---

## 🚀 Quick start
```bash
npm i
npm run dev    # http://localhost:5173
npm run build
npm run preview
