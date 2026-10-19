document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{const university=document.getElementById('university-select');const program=document.getElementById('program-select');if(!university||!program)return;const restore=()=>{const keys=availability[university.value]||Object.keys(window.expandedPrograms);program.innerHTML=keys.filter(key=>window.expandedPrograms[key]).flatMap(key=>window.expandedPrograms[key].programs.map((name,index)=>`<option value="${index}" data-major-key="${key}">${name}</option>`)).join('');};university.addEventListener('change',()=>setTimeout(restore,20));},0));
const nursingProfile={label:'Nursing',programs:['Nursing','Nursing Sciences'],software:'Office, clinical learning systems, research databases, anatomy and nursing reference tools',min:'Core i5 / Ryzen 5, 16GB RAM, 512GB SSD',best:'Core i7 / Ryzen 7, 16GB RAM, 1TB SSD, excellent battery and display',devices:[['HP Pavilion 14','Laptop','$649','16GB RAM, 512GB SSD, portable'],['MacBook Air 15','Laptop','$1,299','Battery life, quiet operation, excellent display'],['iPad Air + Pencil','Tablet','$699','Excellent for clinical notes and lectures']]};
window.expandedPrograms.nursing=nursingProfile;
const majorThemeSelect=document.getElementById('major-select');if(majorThemeSelect&&!majorThemeSelect.querySelector('option[value="nursing"]'))majorThemeSelect.insertAdjacentHTML('beforeend','<option value="nursing">Nursing</option>');
const availability={
 'American University of Beirut (AUB)':['electrical','civil','chemical','biomedical','computer-science','software','architecture','medicine','business','economics','biology','mathematics','psychology'],
 'Lebanese American University (LAU)':['electrical','civil','computer-science','software','architecture','medicine','nursing','business','accounting','media','psychology'],
 'Lebanese University (LU)':['electrical','civil','chemical','mechanical','computer-science','software','architecture','medicine','nursing','business','law','psychology','education','biology','mathematics','nutrition'],
 'Saint Joseph University of Beirut (USJ)':['electrical','civil','computer-science','architecture','medicine','nursing','business','law','psychology','education','biology','nutrition'],
 'University of Balamand (UOB)':['civil','chemical','computer-science','architecture','medicine','nursing','business','psychology','biology'],
 'Beirut Arab University (BAU)':['electrical','civil','mechanical','computer-science','architecture','medicine','business','law','psychology'],
 'Notre Dame University - Louaize (NDU)':['civil','computer-science','architecture','business','law','psychology','media'],
 'Lebanese International University (LIU)':['electrical','civil','mechanical','computer-science','software','architecture','business','accounting','law','education','media'],
 'American University of Science and Technology (AUST)':['electrical','computer-science','software','business','accounting','media'],
 'Arts, Sciences and Technology University in Lebanon (AUL)':['civil','computer-science','business','accounting','media'],
 'Modern University for Business and Science (MUBS)':['computer-science','business','accounting','psychology','education','hospitality'],
 'Antonine University':['electrical','mechanical','computer-science','software','business','education'],
 'Haigazian University':['computer-science','business','psychology','education','biology','mathematics'],
 'Global University':['computer-science','business','education','psychology'],
 'Middle East University (MEU)':['computer-science','business','accounting','education','media'],
 'Rafik Hariri University (RHU)':['civil','computer-science','business','architecture'],
 'Phoenicia University':['business','computer-science','civil','education'],
 'Lebanese German University (LGU)':['civil','mechanical','computer-science','business','hospitality'],
 'Jinan University':['business','computer-science','education','law','psychology'],
 'Islamic University of Lebanon (IUL)':['civil','computer-science','business','law','education'],
 'American University of Culture & Education (AUCE)':['business','computer-science','education'],
 'American University of Technology (AUT)':['computer-science','business','hospitality','media'],
 'Arab Open University':['computer-science','business','education','English'],
 'Beirut Islamic University (BIU)':['business','computer-science','education','law'],
 'Lebanese Canadian University (LCU)':['business','computer-science','hospitality','education'],
 'Makassed University of Beirut':['nursing','medicine','education','business'],
 'Ecole Superieure des Affaires (ESA)':['business','accounting','economics'],
 'City University':['business','computer-science','education','hospitality'],
 'Al-Kafaat University':['business','computer-science','education','hospitality'],
 'University of Tripoli':['business','computer-science','education','law']
};
window.programAvailability=availability;Object.assign(window.expandedPrograms,{English:window.expandedPrograms.education});
const setupUniversityPrograms=()=>{const university=document.getElementById('university-select');const program=document.getElementById('program-select');const major=document.getElementById('major-select');if(!university||!program||!major)return;const fallback=Object.keys(window.expandedPrograms);const render=()=>{const keys=availability[university.value]||fallback;program.innerHTML=keys.filter(key=>window.expandedPrograms[key]).flatMap(key=>window.expandedPrograms[key].programs.map((name,index)=>`<option value="${index}" data-major-key="${key}">${name}</option>`)).join('');const first=program.options[0];if(first){major.value=first.dataset.majorKey;major.dispatchEvent(new Event('change'));}};university.addEventListener('change',render);program.addEventListener('change',()=>{const option=program.selectedOptions[0];if(option?.dataset.majorKey){major.value=option.dataset.majorKey;major.dispatchEvent(new Event('change'));}});render();};document.addEventListener('DOMContentLoaded',()=>setTimeout(setupUniversityPrograms,20));
