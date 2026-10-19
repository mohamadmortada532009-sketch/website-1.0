const majorAtlas={
 electrical:{photo:'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=85',accent:'#ff704c',soft:'#ffc078',ink:'#101718',label:'Electrical Systems'},
 mechatronics:{photo:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1800&q=85',accent:'#20c8bb',soft:'#8cebe0',ink:'#071819',label:'Robotics & Control'},
 mechanical:{photo:'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1800&q=85',accent:'#edaa3e',soft:'#ffe09a',ink:'#17130b',label:'Mechanical Design'},
 'computer-science':{photo:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1800&q=85',accent:'#6aa8ff',soft:'#b8d4ff',ink:'#081326',label:'Computing & AI'},
 architecture:{photo:'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1800&q=85',accent:'#f07d61',soft:'#ffc0a9',ink:'#21100c',label:'Architecture & Space'},
 medicine:{photo:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=85',accent:'#6cc69b',soft:'#b5f0ce',ink:'#071810',label:'Medicine & Care'},
 business:{photo:'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85',accent:'#b388ff',soft:'#dbc8ff',ink:'#160d22',label:'Business & Strategy'},
 media:{photo:'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1800&q=85',accent:'#ff9d5c',soft:'#ffd0a7',ink:'#211108',label:'Media & Creation'}
};
const activateAtlas=key=>{const theme=majorAtlas[key];if(!theme)return;document.body.dataset.major=key;document.documentElement.style.setProperty('--major-photo',`url("${theme.photo}")`);document.documentElement.style.setProperty('--major-accent',theme.accent);document.documentElement.style.setProperty('--major-soft',theme.soft);document.documentElement.style.setProperty('--major-ink',theme.ink);const result=document.getElementById('major-result');if(result)result.dataset.field=theme.label;const hero=document.querySelector('.hero');if(hero)hero.dataset.field=theme.label;};
const atlasSelect=document.getElementById('major-select');if(atlasSelect){atlasSelect.addEventListener('change',()=>activateAtlas(atlasSelect.value));if(atlasSelect.value!=='default')activateAtlas(atlasSelect.value);}
