import { useEffect } from 'react'; // Import useEffect hook

export default function IndexPage() {
  useEffect(() => {
    // Resume Data (Replace with your actual information)
    const resumeData = {
      name: "Tim OHagan",
      title: "Software Engineer",
      contact: {
          email: "your.email@example.com",
          phone: "(123) 456-7890",
          website: "yourwebsite.com",
          linkedin: "linkedin.com/in/yourprofile"
      },
      summary: "A brief summary about yourself and your career goals.",
      experience: [
          {
              company: "Company Name",
              title: "Your Title",
              dates: "Start Date - End Date",
              description: "Description of your role and accomplishments."
          },
          // Add more experience entries as needed
      ],
      education: [
          {
              institution: "Institution Name",
              degree: "Degree Earned",
              dates: "Start Date - End Date",
              description: "Optional description (e.g., major, honors, relevant coursework)"
          },
          // Add more education entries as needed
      ],
      skills: ["Skill 1", "Skill 2", "Skill 3", /* ...more skills */],
      projects: [
          {
              name: "Project Name",
              description: "Description of the project and your role.",
              url: "Project URL (if applicable)"
          },
          // Add more project entries as needed
      ],
      awards: ["Award 1", "Award 2", /* ...more awards */]
  };

  function generateResumeSection(sectionData, sectionTitle) {
    let html = `<h3>${sectionTitle}</h3>`; // Removed <ul> for skills/awards
  
    // Check if it's skills or awards (arrays of strings)
    if (sectionTitle === "Skills" || sectionTitle === "Awards") {
      html += `<ul>`; // Add <ul> for skills/awards only
      sectionData.forEach(item => { // Iterate directly over items
        html += `<li>${item}</li>`;
      });
      html += `</ul>`;
    } else { // Other sections (experience, education, projects)
      html += `<ul>`;
      for (const item of sectionData) {
        html += `<li>`;
        for (const key in item) {
          if (key !== 'url') { 
            html += `<strong>${key}:</strong> ${item[key]}<br>`;
          }
        }
        if (item.url) {
          html += `<a href="${item.url}" target="_blank">View Project</a>`;
        }
        html += `</li>`;
      }
      html += `</ul>`;
    }
  
    return html;
  }

    // Display Resume (update to use React elements)
    const resumeContainer = document.getElementById("resume-container");
    resumeContainer.innerHTML = `
    <h2>${resumeData.name}</h2>
    <p>${resumeData.title}</p>
    <h3>Contact</h3>
    <ul>
        <li>Email: <a href="mailto:${resumeData.contact.email}">${resumeData.contact.email}</a></li>
        <li>Phone: ${resumeData.contact.phone}</li>
        <li>Website: <a href="${resumeData.contact.website}" target="_blank">${resumeData.contact.website}</a></li>
        <li>LinkedIn: <a href="${resumeData.contact.linkedin}" target="_blank">${resumeData.contact.linkedin}</a></li>
    </ul>
    <p>${resumeData.summary}</p>
    ${generateResumeSection(resumeData.experience, "Experience")}
    ${generateResumeSection(resumeData.education, "Education")}
    ${generateResumeSection(resumeData.skills, "Skills")}
    ${generateResumeSection(resumeData.projects, "Projects")}
    ${generateResumeSection(resumeData.awards, "Awards")}
`;
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  return (
    <div id="resume-container">
      {/* Initial loading message while resume data is being fetched */}
      <p>Loading resume...</p> 
    </div>
  );
}