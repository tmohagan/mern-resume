import { useEffect } from 'react';

export default function IndexPage() {
  const resumeData = {
    name: "Tim OHagan",
    contact: {
      email: "tmohagan@gmail.com",
      phone: "(773) 270-1142",
      website: "tim-ohagan.com",
      linkedin: "linkedin.com/in/timothy-ohagan/"
    },
    summary: "Tim O’Hagan is a software engineering with light full-stack experience developing ReactJS UI components and API components built on a spring framework.  His technology experience is in the healthcare and accounting spaces within Walmart where he has worked on 8 to 10 person scrum teams to build full scale applications. Tim is a recent Computer Science graduate transitioning from a Software Engineering Intern to a full-time role.",
    experience: [
      {
        company: "WALMART GLOBAL TECH",
        postition: "Software Engineer II",
        dates: "NOVEMBER 2023 - PRESENT",
        tasks: [
          {
            title: "Served as software engineer on Walmart’s Social Determinants of Health (SDOH) project as follows:",
            details: ["Participated in the planning of SDOH member experience workflow.", "Contributed to development of ReactJS modules.", "Collaborated with QE team to help implement automated tests using JavaScript."]
          },
          {
            title: "Served as software engineer on Walmart’s health clinic patient communications project as follows:",
            details: ["Participated in the planning of new middleware service.", "Contributed to development of Java Spring RESTful API middleware service.", "Collaborated with QE team to help implement automation testing."]
          }
        ]
      },
      {
        company: "WALMART GLOBAL TECH",
        postition: "Software Engineer Intern",
        dates: "FEBRUARY 2023 – NOVEMBER 2023",
        tasks: [
          {
            title: "Served as developer on Financial Technology and Accounting team as follows:",
            details: ["Gained experience working in an agile/scrum environment.", "Learned fundamentals of WCNP and Walmart’s CI/CD pipeline.", "Participated in the full software development lifecycle.", "Collaborated with team proficient in JavaScript, React, Node, Cosmos DB, Scala, Kotlin, etc. to adopt and implement best practices."]
          }
        ]
      },
    ],
    skills: ["Java", "Kotlin", "JavaScript", "React", "Scala", "Python", "SQL"],
    technologies: ["WCNP", "CI/CD", "Concord", "Looper", "Docker", "Kubernetes", "Git", "Maven", "Micro Services", "Spring", "Test Automation", "CosmosDB"],
    projects: [
      {
        title: "This site",
        description: "This site was created using JavaScript, React, Node.js, Express, MongoDB. It is hosted on Vercel."
      },
      // ... more project entries
    ],
    education: [
      {
        institution: "SOUTHERN NEW HAMPSHIRE UNIVERSITY",
        degree: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
        dates: "NOVEMBER 2023"
      }
    ]
  };

  return (
    <div className="resume">

        <h1>{resumeData.name}</h1>
        <div className="contact">
          <p>{resumeData.contact.email}</p>
          <p>{resumeData.contact.phone}</p>
        </div>


      <section className="summary">
        <h2>Summary</h2>
        <p>{resumeData.summary}</p>
      </section>

      <section className="experience">
        <h2>Experience</h2>
        <ul>
          {resumeData.experience.map((exp, index) => (
            <li key={index}>
              <h3>{exp.company}</h3>
              <h4>{exp.postition}</h4>
              <p className="dates">{exp.dates}</p>
              <ul className="tasks">
                {exp.tasks.map((task, taskIndex) => (
                  <li key={taskIndex}>
                    <h4>{task.title}</h4>
                    <ul className="details">
                      {task.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>{detail}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
      <section className="skills">
        <h2>Skills</h2>
        <ul>
          {resumeData.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className="technologies">
        <h2>Technologies</h2>
        <ul>
          {resumeData.technologies.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </section>

      <section className="projects">
        <h2>Projects</h2>
        <ul>
          {resumeData.projects.map((project, index) => (
            <li key={index}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="education">
        <h2>Education</h2>
        <ul>
          {resumeData.education.map((edu, index) => (
            <li key={index}>
              <h3>{edu.institution}</h3>
              <p className="degree">{edu.degree}</p>
              <p className="dates">{edu.dates}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
