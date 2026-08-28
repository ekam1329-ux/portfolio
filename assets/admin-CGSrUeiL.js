import{g as h,s as a,d as _}from"./data-DKcONdd1.js";document.addEventListener("DOMContentLoaded",()=>{k(),q(),A()});const E="admin",I="ekamsingh2026#admin";function x(){return localStorage.getItem("admin_password")||I}function k(){const t=document.getElementById("admin-login-form"),n=document.getElementById("login-error"),l=document.getElementById("admin-auth-container"),d=document.getElementById("admin-dashboard-container"),e=document.getElementById("admin-logout-btn");sessionStorage.getItem("admin_authenticated")==="true"&&(l&&(l.style.display="none"),d&&(d.style.display="block"),f()),t&&t.addEventListener("submit",i=>{i.preventDefault();const o=document.getElementById("admin-username").value.trim(),r=document.getElementById("admin-password").value;o===E&&r===x()?(sessionStorage.setItem("admin_authenticated","true"),l&&(l.style.display="none"),d&&(d.style.display="block"),f()):n&&(n.innerText="Invalid credentials. Try again.")}),e&&e.addEventListener("click",()=>{sessionStorage.removeItem("admin_authenticated"),window.location.reload()})}function q(){const t=document.querySelectorAll(".tab-btn");t.forEach(n=>{n.addEventListener("click",()=>{t.forEach(e=>e.classList.remove("active")),n.classList.add("active");const l=n.getAttribute("data-tab");document.querySelectorAll(".admin-tab-content").forEach(e=>{e.classList.remove("active")});const d=document.getElementById(`tab-${l}`);d&&d.classList.add("active")})})}function f(){const t=h();g(),B(t),m(t),b(t),p(t),u(t),y(t),$(),j()}function g(){const t=document.getElementById("messages-list-container"),n=document.getElementById("unread-count-badge");if(!t)return;const l=JSON.parse(localStorage.getItem("portfolio_messages")||"[]");if(n&&(n.innerText=l.length),l.length===0){t.innerHTML=`
      <div class="glass-card" style="text-align: center; color: var(--text-muted); padding: 3rem;">
        <h3>No Messages Received Yet</h3>
        <p>Submitted contact forms from index.html will automatically appear here.</p>
      </div>
    `;return}t.innerHTML=l.map((e,i)=>`
    <div class="glass-card message-item-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
        <div>
          <h3 style="font-size: 1.2rem; color: var(--accent-gold);">${e.subject||"No Subject"}</h3>
          <div style="font-size: 0.9rem; color: var(--text-primary); font-weight: 600;">
            From: ${e.name} (&lt;${e.email}&gt;)
          </div>
        </div>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${e.date||"Recent"}</span>
      </div>
      <p style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1rem;">
        ${e.message}
      </p>
      <button class="btn btn-small btn-outline delete-msg-btn" data-index="${i}">Delete Message</button>
    </div>
  `).join(""),document.querySelectorAll(".delete-msg-btn").forEach(e=>{e.onclick=()=>{const i=parseInt(e.getAttribute("data-index"));l.splice(i,1),localStorage.setItem("portfolio_messages",JSON.stringify(l)),g()}});const d=document.getElementById("clear-messages-btn");d&&(d.onclick=()=>{confirm("Clear all inbox messages?")&&(localStorage.removeItem("portfolio_messages"),g())})}function B(t){const n=t.personal||{},l=document.getElementById("edit-personal-form"),d=document.getElementById("personal-save-status");l&&(document.getElementById("p-name").value=n.name||"",document.getElementById("p-title").value=n.title||"",document.getElementById("p-tagline").value=n.tagline||"",document.getElementById("p-qualifications").value=n.qualifications||"",document.getElementById("p-bio1").value=n.bioP1||"",document.getElementById("p-bio2").value=n.bioP2||"",document.getElementById("p-quote").value=n.quote||"",document.getElementById("p-email").value=n.email||"",document.getElementById("p-phone").value=n.phone||"",document.getElementById("p-location").value=n.location||"",l.onsubmit=e=>{e.preventDefault(),n.name=document.getElementById("p-name").value,n.title=document.getElementById("p-title").value,n.tagline=document.getElementById("p-tagline").value,n.qualifications=document.getElementById("p-qualifications").value,n.bioP1=document.getElementById("p-bio1").value,n.bioP2=document.getElementById("p-bio2").value,n.quote=document.getElementById("p-quote").value,n.email=document.getElementById("p-email").value,n.phone=document.getElementById("p-phone").value,n.location=document.getElementById("p-location").value,t.personal=n,a(t),d.style.color="var(--accent-emerald)",d.innerText="Personal details & Bio updated successfully!"})}function m(t){const n=document.getElementById("publications-admin-list");if(!n)return;const l=t.publications||[];n.innerHTML=l.map((e,i)=>`
    <div class="glass-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="pub-tag">${e.type}</span>
          <h3 style="color: var(--accent-gold); font-size: 1.3rem; margin: 0.5rem 0;">${e.title}</h3>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
            <strong>Journal:</strong> ${e.journal} | <strong>Date:</strong> ${e.date} | <strong>Publisher:</strong> ${e.publisher}
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">${e.abstract}</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-small btn-primary edit-pub-btn" data-index="${i}">✏️ Edit Details</button>
          <button class="btn btn-small btn-outline remove-pub-btn" data-index="${i}">🗑️ Delete</button>
        </div>
      </div>
      <a href="${e.link}" target="_blank" class="btn btn-small btn-glass">Link: ${e.link} ↗</a>
    </div>
  `).join(""),document.querySelectorAll(".edit-pub-btn").forEach(e=>{e.onclick=()=>{const i=parseInt(e.getAttribute("data-index")),o=l[i];s("Edit Publication Details",[{label:"Title",id:"pub_title",type:"text",required:!0,default:o.title},{label:"Publication Type",id:"pub_type",type:"text",default:o.type},{label:"Journal / Volume",id:"pub_journal",type:"text",required:!0,default:o.journal},{label:"Date",id:"pub_date",type:"text",required:!0,default:o.date},{label:"Publisher / Location",id:"pub_publisher",type:"text",required:!0,default:o.publisher},{label:"Flipbook / Article Link",id:"pub_link",type:"url",required:!0,default:o.link},{label:"Abstract / Summary",id:"pub_abstract",type:"textarea",required:!0,default:o.abstract}],r=>{l[i]={...o,title:r.pub_title,type:r.pub_type,journal:r.pub_journal,date:r.pub_date,publisher:r.pub_publisher,link:r.pub_link,abstract:r.pub_abstract},t.publications=l,a(t),m(t)})}}),document.querySelectorAll(".remove-pub-btn").forEach(e=>{e.onclick=()=>{const i=parseInt(e.getAttribute("data-index"));confirm("Delete this publication?")&&(l.splice(i,1),t.publications=l,a(t),m(t))}});const d=document.getElementById("add-pub-modal-btn");d&&(d.onclick=()=>{s("Add New Publication",[{label:"Title",id:"pub_title",type:"text",required:!0},{label:"Publication Type",id:"pub_type",type:"text",default:"Research Article"},{label:"Journal / Volume",id:"pub_journal",type:"text",required:!0},{label:"Date",id:"pub_date",type:"text",required:!0},{label:"Publisher / Location",id:"pub_publisher",type:"text",required:!0},{label:"Flipbook / Article URL",id:"pub_link",type:"url",required:!0},{label:"Abstract / Summary",id:"pub_abstract",type:"textarea",required:!0}],e=>{t.publications.push({id:"pub-"+Date.now(),title:e.pub_title,type:e.pub_type,journal:e.pub_journal,date:e.pub_date,publisher:e.pub_publisher,link:e.pub_link,abstract:e.pub_abstract}),a(t),m(t)})})}function b(t){const n=document.getElementById("research-admin-list");if(!n)return;const l=t.researchInterests||[];n.innerHTML=l.map((e,i)=>`
    <div class="glass-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span style="font-size: 1.8rem; font-weight: 700; color: var(--accent-gold);">${e.highlightNumber}</span>
          <h3 style="font-size: 1.2rem; margin: 0.4rem 0;">${e.title}</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${e.description}</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-small btn-primary edit-res-btn" data-index="${i}">✏️ Edit Details</button>
          <button class="btn btn-small btn-outline remove-res-btn" data-index="${i}">🗑️ Delete</button>
        </div>
      </div>
    </div>
  `).join(""),document.querySelectorAll(".edit-res-btn").forEach(e=>{e.onclick=()=>{const i=parseInt(e.getAttribute("data-index")),o=l[i];s("Edit Research Topic Details",[{label:"Topic Title",id:"res_title",type:"text",required:!0,default:o.title},{label:"Highlight Symbol (e.g. 1, 8, 40)",id:"res_num",type:"text",required:!0,default:o.highlightNumber},{label:"Description",id:"res_desc",type:"textarea",required:!0,default:o.description}],r=>{l[i]={...o,title:r.res_title,highlightNumber:r.res_num,description:r.res_desc},t.researchInterests=l,a(t),b(t)})}}),document.querySelectorAll(".remove-res-btn").forEach(e=>{e.onclick=()=>{const i=parseInt(e.getAttribute("data-index"));l.splice(i,1),t.researchInterests=l,a(t),b(t)}});const d=document.getElementById("add-research-modal-btn");d&&(d.onclick=()=>{s("Add Research Topic",[{label:"Topic Title",id:"res_title",type:"text",required:!0},{label:"Highlight Symbol (e.g. 1, 8, 40)",id:"res_num",type:"text",required:!0},{label:"Description",id:"res_desc",type:"textarea",required:!0}],e=>{t.researchInterests.push({id:"res-"+Date.now(),title:e.res_title,highlightNumber:e.res_num,description:e.res_desc}),a(t),b(t)})})}function p(t){const n=document.getElementById("talks-admin-list");if(!n)return;const l=t.talks||[];n.innerHTML=l.map((e,i)=>`
    <div class="glass-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="section-tag">${e.event}</span>
          <h3 style="color: var(--accent-gold); font-size: 1.3rem; margin: 0.4rem 0;">${e.title}</h3>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
            📍 ${e.location} (${e.date}) | YouTube ID: <strong>${e.youtubeId}</strong>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;">${e.description}</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-small btn-primary edit-talk-btn" data-index="${i}">✏️ Edit Details</button>
          <button class="btn btn-small btn-outline remove-talk-btn" data-index="${i}">🗑️ Delete</button>
        </div>
      </div>
      <a href="${e.link}" target="_blank" class="btn btn-small btn-glass">Link: ${e.link} ↗</a>
    </div>
  `).join(""),document.querySelectorAll(".edit-talk-btn").forEach(e=>{e.onclick=()=>{const i=parseInt(e.getAttribute("data-index")),o=l[i];s("Edit Talk / Lecture Details",[{label:"Lecture Title",id:"talk_title",type:"text",required:!0,default:o.title},{label:"Event Series",id:"talk_event",type:"text",required:!0,default:o.event},{label:"Date",id:"talk_date",type:"text",required:!0,default:o.date},{label:"Location",id:"talk_loc",type:"text",required:!0,default:o.location},{label:"YouTube Video ID",id:"talk_yt",type:"text",required:!0,default:o.youtubeId},{label:"YouTube Link",id:"talk_link",type:"url",required:!0,default:o.link},{label:"Description",id:"talk_desc",type:"textarea",required:!0,default:o.description}],r=>{l[i]={...o,title:r.talk_title,event:r.talk_event,date:r.talk_date,location:r.talk_loc,youtubeId:r.talk_yt,link:r.talk_link,description:r.talk_desc},t.talks=l,a(t),p(t)})}}),document.querySelectorAll(".remove-talk-btn").forEach(e=>{e.onclick=()=>{const i=parseInt(e.getAttribute("data-index"));l.splice(i,1),t.talks=l,a(t),p(t)}});const d=document.getElementById("add-talk-modal-btn");d&&(d.onclick=()=>{s("Add Talk / Lecture Video",[{label:"Lecture Title",id:"talk_title",type:"text",required:!0},{label:"Event Series",id:"talk_event",type:"text",required:!0},{label:"Date",id:"talk_date",type:"text",required:!0},{label:"Location",id:"talk_loc",type:"text",required:!0},{label:"YouTube Video ID (e.g. E8isUpse27s)",id:"talk_yt",type:"text",required:!0},{label:"Full YouTube Link",id:"talk_link",type:"url",required:!0},{label:"Lecture Description",id:"talk_desc",type:"textarea",required:!0}],e=>{t.talks.push({id:"talk-"+Date.now(),title:e.talk_title,event:e.talk_event,date:e.talk_date,location:e.talk_loc,youtubeId:e.talk_yt,link:e.talk_link,description:e.talk_desc}),a(t),p(t)})})}function u(t){const n=document.getElementById("journey-admin-list");if(!n)return;const l=t.education||[],d=t.experience||[];n.innerHTML=`
    <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Education & Qualifications</h3>
    ${l.map((i,o)=>`
      <div class="glass-card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <span class="pub-tag">${i.badge}</span>
            <h4 style="font-size: 1.15rem; margin: 0.3rem 0;">${i.degree} (${i.field})</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">${i.institution} • ${i.year}</div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">${i.details}</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-small btn-primary edit-edu-btn" data-index="${o}">✏️ Edit</button>
            <button class="btn btn-small btn-outline remove-edu-btn" data-index="${o}">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `).join("")}

    <h3 style="color: var(--accent-gold); margin: 2rem 0 1rem 0;">Faculty & Teaching Experience</h3>
    ${d.map((i,o)=>`
      <div class="glass-card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 style="font-size: 1.15rem; margin-bottom: 0.3rem;">${i.role}</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">${i.institution}, ${i.location} (${i.period})</div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">${i.responsibilities}</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-small btn-primary edit-exp-btn" data-index="${o}">✏️ Edit</button>
            <button class="btn btn-small btn-outline remove-exp-btn" data-index="${o}">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `).join("")}
  `,document.querySelectorAll(".edit-edu-btn").forEach(i=>{i.onclick=()=>{const o=parseInt(i.getAttribute("data-index")),r=l[o];s("Edit Degree / Qualification Details",[{label:"Degree / Title",id:"j_degree",type:"text",required:!0,default:r.degree},{label:"Field / Subject",id:"j_field",type:"text",required:!0,default:r.field},{label:"Institution / University",id:"j_inst",type:"text",required:!0,default:r.institution},{label:"Year / Period",id:"j_year",type:"text",required:!0,default:r.year},{label:"Honor Badge",id:"j_badge",type:"text",required:!0,default:r.badge},{label:"Details / Description",id:"j_details",type:"textarea",required:!0,default:r.details}],c=>{l[o]={...r,degree:c.j_degree,field:c.j_field,institution:c.j_inst,year:c.j_year,badge:c.j_badge,details:c.j_details},t.education=l,a(t),u(t)})}}),document.querySelectorAll(".remove-edu-btn").forEach(i=>{i.onclick=()=>{const o=parseInt(i.getAttribute("data-index"));l.splice(o,1),t.education=l,a(t),u(t)}}),document.querySelectorAll(".remove-exp-btn").forEach(i=>{i.onclick=()=>{const o=parseInt(i.getAttribute("data-index"));d.splice(o,1),t.experience=d,a(t),u(t)}});const e=document.getElementById("add-journey-modal-btn");e&&(e.onclick=()=>{s("Add Degree / Qualification",[{label:"Degree / Title",id:"j_degree",type:"text",required:!0},{label:"Field / Subject",id:"j_field",type:"text",required:!0},{label:"Institution / University",id:"j_inst",type:"text",required:!0},{label:"Year / Period",id:"j_year",type:"text",required:!0},{label:"Honor Badge (e.g. First Division with Distinction)",id:"j_badge",type:"text",required:!0},{label:"Details / Description",id:"j_details",type:"textarea",required:!0}],i=>{t.education.push({id:"edu-"+Date.now(),degree:i.j_degree,field:i.j_field,institution:i.j_inst,year:i.j_year,badge:i.j_badge,details:i.j_details}),a(t),u(t)})})}function y(t){const n=document.getElementById("conferences-admin-list");if(!n)return;const l=t.conferences||[];n.innerHTML=l.map((e,i)=>`
    <div class="glass-card" style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="conf-type">${e.type} • ${e.year}</span>
          <h4 style="font-size: 1.1rem; margin: 0.3rem 0;">${e.title}</h4>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">🏛️ ${e.organizer}</div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-small btn-primary edit-conf-btn" data-index="${i}">✏️ Edit</button>
          <button class="btn btn-small btn-outline remove-conf-btn" data-index="${i}">🗑️ Delete</button>
        </div>
      </div>
    </div>
  `).join(""),document.querySelectorAll(".edit-conf-btn").forEach(e=>{e.onclick=()=>{const i=parseInt(e.getAttribute("data-index")),o=l[i];s("Edit Conference Details",[{label:"Event Title",id:"c_title",type:"text",required:!0,default:o.title},{label:"Year",id:"c_year",type:"text",required:!0,default:o.year},{label:"Event Type",id:"c_type",type:"text",required:!0,default:o.type},{label:"Organizer / Institution",id:"c_org",type:"text",required:!0,default:o.organizer}],r=>{l[i]={...o,title:r.c_title,year:r.c_year,type:r.c_type,organizer:r.c_org},t.conferences=l,a(t),y(t)})}}),document.querySelectorAll(".remove-conf-btn").forEach(e=>{e.onclick=()=>{const i=parseInt(e.getAttribute("data-index"));l.splice(i,1),t.conferences=l,a(t),y(t)}});const d=document.getElementById("add-conf-modal-btn");d&&(d.onclick=()=>{s("Add Conference / Webinar",[{label:"Event Title",id:"c_title",type:"text",required:!0},{label:"Year",id:"c_year",type:"text",required:!0},{label:"Event Type (e.g. International Webinar)",id:"c_type",type:"text",required:!0},{label:"Organizer / Institution",id:"c_org",type:"text",required:!0}],e=>{t.conferences.push({id:"conf-"+Date.now(),title:e.c_title,year:e.c_year,type:e.c_type,organizer:e.c_org}),a(t),y(t)})})}function $(){const t=document.getElementById("change-password-form"),n=document.getElementById("password-status");t&&(t.onsubmit=d=>{d.preventDefault();const e=document.getElementById("current-pass").value,i=document.getElementById("new-pass").value;if(e!==x()){n.style.color="#ef4444",n.innerText="Current password incorrect.";return}localStorage.setItem("admin_password",i),n.style.color="var(--accent-emerald)",n.innerText="Admin password updated successfully!",t.reset()});const l=document.getElementById("reset-data-btn");l&&(l.onclick=()=>{confirm("Are you sure you want to reset all portfolio data to default CV content?")&&(a(_),alert("Portfolio data reset to default successfully!"),window.location.reload())})}function s(t,n,l){const d=document.getElementById("admin-editor-modal"),e=document.getElementById("admin-modal-title"),i=document.getElementById("admin-form-fields"),o=document.getElementById("admin-dynamic-form");!d||!i||!o||(e.innerText=t,i.innerHTML=n.map(r=>`
    <div class="form-group" style="margin-bottom: 1rem;">
      <label for="${r.id}">${r.label}</label>
      ${r.type==="textarea"?`<textarea id="${r.id}" rows="3" ${r.required?"required":""}>${r.default||""}</textarea>`:`<input type="${r.type}" id="${r.id}" value="${r.default||""}" ${r.required?"required":""}>`}
    </div>
  `).join(""),d.classList.add("open"),o.onsubmit=r=>{r.preventDefault();const c={};n.forEach(v=>{c[v.id]=document.getElementById(v.id).value}),l(c),d.classList.remove("open")})}function j(){const t=document.getElementById("admin-editor-modal"),n=document.getElementById("admin-modal-close");n&&t&&(n.onclick=()=>t.classList.remove("open"))}function A(){const t=document.getElementById("admin-theme-toggle"),n=document.getElementById("admin-theme-icon"),l=document.getElementById("admin-theme-text");(localStorage.getItem("theme")||"dark")==="light"&&(document.body.classList.add("light-theme"),n&&(n.innerText="☀️"),l&&(l.innerText="Bright")),t&&(t.onclick=()=>{!document.body.classList.contains("light-theme")?(document.body.classList.add("light-theme"),n&&(n.innerText="☀️"),l&&(l.innerText="Bright"),localStorage.setItem("theme","light")):(document.body.classList.remove("light-theme"),n&&(n.innerText="🌙"),l&&(l.innerText="Dark"),localStorage.setItem("theme","dark"))})}
