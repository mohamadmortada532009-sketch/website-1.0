const majorVisuals={
 electrical:{label:'Electrical lab',title:'Measure. Prototype. Power.',items:['V','Ω','↯','⌁'],note:'Multimeter / circuit bench'},
 mechatronics:{label:'Robotics lab',title:'Sense. Build. Move.',items:['⚙','◉','⌁','▣'],note:'Motors / sensors / control'},
 mechanical:{label:'Design workshop',title:'Model. Stress. Refine.',items:['⚙','▱','∿','⌁'],note:'CAD / mechanics / simulation'},
 'computer-science':{label:'Compute lab',title:'Code. Train. Ship.',items:['</>','01','{}','⌘'],note:'Systems / data / intelligence'},
 architecture:{label:'Design studio',title:'Draw. Shape. Build.',items:['⌂','▱','⌐','✦'],note:'Plans / materials / light'},
 medicine:{label:'Clinical study',title:'Learn. Diagnose. Care.',items:['+','◉','⌁','♡'],note:'Research / imaging / care'},
 business:{label:'Strategy desk',title:'Measure. Decide. Grow.',items:['↗','$','▥','◎'],note:'Markets / data / decisions'},
 media:{label:'Creative studio',title:'Frame. Edit. Express.',items:['◉','▶','✦','♫'],note:'Image / motion / sound'}
};
const renderMajorVisual=key=>{const visual=majorVisuals[key];if(!visual)return;let panel=document.getElementById('major-visual');if(!panel){panel=document.createElement('div');panel.id='major-visual';panel.className='major-visual';const result=document.getElementById('major-result');result.parentElement.insertBefore(panel,result);}panel.className=`major-visual major-visual-${key}`;panel.innerHTML=`<div class="visual-top"><span>${visual.label}</span><b>FIELD MODE</b></div><div class="visual-stage">${visual.items.map((item,index)=>`<span class="visual-object object-${index}">${item}</span>`).join('')}<i class="visual-line line-one"></i><i class="visual-line line-two"></i></div><strong>${visual.title}</strong><small>${visual.note}</small>`;};
const visualForm=document.getElementById('major-form');if(visualForm)visualForm.addEventListener('submit',()=>setTimeout(()=>renderMajorVisual(document.getElementById('major-select').value),0));const visualSelect=document.getElementById('major-select');if(visualSelect)visualSelect.addEventListener('change',()=>renderMajorVisual(visualSelect.value));
