import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const projects = [
  { id:'html', name:'Hello HTML', category:'Web Fundamentals', tech:'HTML', type:'lab', path:'/labs/hello-html/index.html', description:'The starting point: document structure, semantic HTML and browser fundamentals.' },
  { id:'calculator', name:'Calculator', category:'JavaScript', tech:'HTML • CSS • JavaScript', type:'lab', path:'/labs/calculator/index.html', description:'Interactive application logic, events and DOM manipulation.' },
  { id:'clock', name:'Digital Clock', category:'JavaScript', tech:'JavaScript', type:'lab', path:'/labs/digital-clock/index.html', description:'Time-based UI, browser APIs and dynamic rendering.' },
  { id:'counter', name:'JavaScript Counter', category:'JavaScript', tech:'JavaScript', type:'lab', path:'/labs/javascript-counter/index.html', description:'State, events and reusable application logic.' },
  { id:'advanced', name:'Advanced Counter', category:'JavaScript', tech:'JavaScript', type:'lab', path:'/labs/advanced-counter/index.html', description:'An extended exercise in application state and interaction.' },
  { id:'todo', name:'Todo Application', category:'Applications', tech:'JavaScript • Jest', type:'source', path:'/apps/03-applications/todo-app', description:'Modular application architecture, local persistence and unit testing.' },
  { id:'tasks', name:'Task Manager', category:'Applications', tech:'JavaScript', type:'lab', path:'/labs/task-manager/index.html', description:'Task-oriented application logic and UI interaction.' },
  { id:'react', name:'React Task Dashboard', category:'React', tech:'React • Vite', type:'source', path:'/apps/04-react/react-task-dashboard', description:'Component architecture, reusable UI and modern frontend development.' },
  { id:'fastapi', name:'FastAPI Backend', category:'Backend', tech:'Python • FastAPI', type:'source', path:'/apps/05-backend/FastAPI-Learning', description:'REST API architecture, models, persistence and backend testing.' },
  { id:'changestory', name:'ChangeStory', category:'Data & Intelligence', tech:'TypeScript • Data Analysis • Evidence', type:'lab', path:'./changestory/index.html', description:'Interactive change reconstruction: timeline, evidence levels, dependencies, impact and executive/technical views.' }
]

const technologies = [
  ['HTML / CSS','Web fundamentals'],
  ['JavaScript','Application logic'],
  ['React','Component architecture'],
  ['Python','Backend development'],
  ['FastAPI','REST APIs'],
  ['Jest','Automated testing'],
  ['Git / GitHub','Version control'],
  ['CI/CD','Engineering workflow'],
  ['Docker','Containerisation'],
  ['REST','System integration']
]

function App() {
  const [active, setActive] = useState('all')
  const [selected, setSelected] = useState(null)

  const categories = ['all', ...new Set(projects.map(p => p.category))]
  const visible = active === 'all' ? projects : projects.filter(p => p.category === active)

  return (
    <div className='app'>
      <header className='hero'>
        <div className='hero-grid'>
          <div>
            <div className='eyebrow'>AB / ENGINEERING LAB</div>
            <h1>One project.<br/><span>Many engineering disciplines.</span></h1>
            <p className='hero-text'>
              A unified development laboratory showing the progression
              from web fundamentals to JavaScript, React, APIs and backend engineering.
            </p>
            <div className='hero-actions'>
              <a href='#projects' className='primary'>Explore the Lab</a>
              <a href='#architecture' className='secondary'>View Architecture</a>
            </div>
          </div>
          <div className='system-card'>
            <div className='system-top'><span>SYSTEM</span><b>ONLINE</b></div>
            <div className='orb'></div>
            <div className='system-line'>
              <span>FRONTEND</span><strong>REACT</strong>
            </div>
            <div className='system-line'>
              <span>BACKEND</span><strong>FASTAPI</strong>
            </div>
            <div className='system-line'>
              <span>PROJECTS</span><strong>10</strong>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className='stats'>
          <div><strong>10</strong><span>Projects integrated</span></div>
          <div><strong>10+</strong><span>Technology areas</span></div>
          <div><strong>05</strong><span>Development stages</span></div>
          <div><strong>01</strong><span>Engineering Lab</span></div>
        </section>

        <section id='projects' className='section'>
          <div className='section-heading'>
            <div>
              <div className='eyebrow'>PROJECT EXPLORER</div>
              <h2>Everything in one system.</h2>
            </div>
            <p>Select a discipline to filter the laboratory.</p>
          </div>

          <div className='filters'>
            {categories.map(category => (
              <button
                key={category}
                className={active === category ? 'filter active' : 'filter'}
                onClick={() => setActive(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>

          <div className='project-grid'>
            {visible.map(project => (
              <article className='project-card' key={project.id}>
                <div className='project-number'>{project.id.toUpperCase()}</div>
                <div className='project-category'>{project.category}</div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className='tech'>{project.tech}</div>
                <div className='card-actions'>
                  {project.type === 'lab' ? (
                    <button onClick={() => setSelected(project)}>Open Lab</button>
                  ) : (
                    <a href={project.path} target='_blank' rel='noreferrer'>View Source</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id='architecture' className='section architecture'>
          <div className='section-heading'>
            <div>
              <div className='eyebrow'>SYSTEM ARCHITECTURE</div>
              <h2>From browser to backend.</h2>
            </div>
          </div>

          <div className='architecture-flow'>
            <div className='arch-node'>
              <span>01</span>
              <strong>React UI</strong>
              <small>Components • State • Routing</small>
            </div>
            <div className='arrow'>→</div>
            <div className='arch-node'>
              <span>02</span>
              <strong>REST API</strong>
              <small>HTTP • JSON • Validation</small>
            </div>
            <div className='arrow'>→</div>
            <div className='arch-node'>
              <span>03</span>
              <strong>FastAPI</strong>
              <small>Routes • Services • Models</small>
            </div>
            <div className='arrow'>→</div>
            <div className='arch-node'>
              <span>04</span>
              <strong>Data</strong>
              <small>Persistence • Testing</small>
            </div>
          </div>
        </section>

        <section className='section'>
          <div className='section-heading'>
            <div>
              <div className='eyebrow'>TECHNOLOGY MATRIX</div>
              <h2>What the lab demonstrates.</h2>
            </div>
          </div>

          <div className='technology-grid'>
            {technologies.map(([name, detail], index) => (
              <div className='technology' key={name}>
                <span>0{index + 1}</span>
                <strong>{name}</strong>
                <small>{detail}</small>
              </div>
            ))}
          </div>
        </section>

        <section className='section evolution'>
          <div className='section-heading'>
            <div>
              <div className='eyebrow'>DEVELOPMENT EVOLUTION</div>
              <h2>One continuous engineering path.</h2>
            </div>
          </div>

          <div className='timeline'>
            <div><span>01</span><strong>Web</strong><small>HTML / CSS</small></div>
            <div><span>02</span><strong>Logic</strong><small>JavaScript</small></div>
            <div><span>03</span><strong>Apps</strong><small>Todo / Tasks</small></div>
            <div><span>04</span><strong>Frontend</strong><small>React</small></div>
            <div><span>05</span><strong>Backend</strong><small>Python / FastAPI</small></div>
            <div><span>06</span><strong>Full Stack</strong><small>Integration</small></div>
          </div>
        </section>
      </main>

      <footer>
        <strong>AB ENGINEERING LAB</strong>
        <span>Built as one continuous engineering project.</span>
        <a href='https://github.com/abla86/AB-Engineering-Lab' target='_blank' rel='noreferrer'>GitHub ↗</a>
      </footer>

      {selected && (
        <div className='modal' onClick={() => setSelected(null)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <button className='close' onClick={() => setSelected(null)}>×</button>
            <div className='eyebrow'>LIVE LAB</div>
            <h2>{selected.name}</h2>
            <iframe title={selected.name} src={selected.path}></iframe>
          </div>
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
