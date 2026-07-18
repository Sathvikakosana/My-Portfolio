// --- IRON-CLAD PRELOADER ---
window.addEventListener('load', () => {
  
  initThreeJS(); 
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const preloader = document.getElementById('preloader');
      const mainContent = document.getElementById('main-content');
      
      preloader.style.opacity = '0'; 
      
      setTimeout(() => {
        preloader.style.display = 'none'; 
        mainContent.style.display = 'block';
        setTimeout(() => {
          mainContent.style.opacity = '1';
          initAnimations(); 
          ScrollTrigger.refresh(); 
        }, 50);
      }, 400); 
    });
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// --- FASTER GSAP ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

function initAnimations() {
  gsap.fromTo(".init-anim", 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
  );

  gsap.to('#profile-card',{
    y: -60, rotationY: 15, ease: 'none',
    scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub: 0.5} 
  });

  document.querySelectorAll('.bar').forEach(bar => {
    const value = bar.getAttribute('data-value') || 80;
    gsap.to(bar.querySelector('i'), {
      width: value + '%',
      scrollTrigger: { trigger: bar, start: 'top 98%' }, 
      duration: 0.8, ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.scroll-3d-element').forEach((el, i) => {
    gsap.fromTo(el, 
      { rotationX: 5, y: 30, opacity: 0, scale: 0.98 }, 
      { rotationX: 0, y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 98%' } 
      }
    );
  });
}

// --- SMART THREE.JS ---
function initThreeJS() {
  const root = document.getElementById('three-root');
  const scene = new THREE.Scene();
  
  let width = root.clientWidth || 460;
  let height = root.clientHeight || 420;
  
  const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
  camera.position.set(0,0,180);

  const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setSize(width, height); 
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  root.appendChild(renderer.domElement);

  // Updated lighting to match Copper and Peach accents
  const light1 = new THREE.DirectionalLight(0xb87b6a, 1.5); light1.position.set(50,50,100);
  const light2 = new THREE.DirectionalLight(0xdfa897, 1.0); light2.position.set(-50,-30,80);
  scene.add(light1, light2);

  const g = new THREE.IcosahedronGeometry(50, 3);
  // Updated solid inner core to a darker copper
  const mat = new THREE.MeshStandardMaterial({
    roughness: 0.1, metalness: 0.7, color: 0x9c5e4a, transparent: true, opacity: 0.9
  });
  const orb = new THREE.Mesh(g, mat); scene.add(orb);

  const geo2 = new THREE.IcosahedronGeometry(72, 2);
  // Updated wireframe shell to light peach
  const mat2 = new MeshBasicMaterial({color: 0xdfa897, wireframe: true, opacity: 0.15, transparent: true});
  const shell = new THREE.Mesh(geo2, mat2); scene.add(shell);

  const pCount = 100; const pts = new THREE.BufferGeometry();
  const arr = new Float32Array(pCount*3);
  for(let i=0; i<pCount; i++){ 
    arr[i*3+0] = (Math.random()-0.5)*280; 
    arr[i*3+1] = (Math.random()-0.5)*280; 
    arr[i*3+2] = (Math.random()-0.5)*280; 
  }
  pts.setAttribute('position', new THREE.BufferAttribute(arr,3));
  // Updated floating particles to light peach
  const part = new THREE.Points(pts, new THREE.PointsMaterial({size:3, opacity:0.8, color: 0xdfa897, transparent:true})); 
  scene.add(part);

  let isHeroVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isHeroVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(document.getElementById('hero'));

  function loop(t) {
    if(isHeroVisible) {
      orb.rotation.y += 0.004; orb.rotation.x = Math.sin(t/2000)*0.1;
      shell.rotation.y -= 0.002; shell.rotation.x += 0.001; part.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(loop);
  }
  loop(0);

  window.addEventListener('resize', () => {
    if(!root.clientWidth) return;
    width = root.clientWidth; height = root.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  const heroWrap = document.querySelector('.hero-wrap');
  heroWrap.addEventListener('mousemove', e => {
    if(!isHeroVisible) return;
    const bounds = heroWrap.getBoundingClientRect();
    const x = (e.clientX - bounds.left)/bounds.width - 0.5;
    const y = (e.clientY - bounds.top)/bounds.height - 0.5;
    gsap.to(orb.rotation, {y: x, x: y, duration: 1});
    gsap.to(shell.rotation, {y: x*-0.8, x: y*-0.6, duration: 1.2});
  });
}

const MeshBasicMaterial = THREE.MeshBasicMaterial;

// --- MAILTO FUNCTION ---
function sendMessage(){
  const name=document.getElementById('name').value||'Recruiter/Collaborator';
  const email=document.getElementById('email').value||'no-reply@example.com';
  const message=document.getElementById('message').value||'';
  const body = `Hi Sathvika,\n\nI am ${name} (${email}).\n\n${message}`;
  window.location.href = `mailto:kosanasathvika@gmail.com?subject=${encodeURIComponent('Portfolio Inquiry from '+name)}&body=${encodeURIComponent(body)}`;
}
