// Ensure preloader finishes cleanly
window.addEventListener('load', () => {
  initThreeJS();
  
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      initGSAP();
    }, 500);
  }, 500); // Slight delay to ensure smooth rendering
});

document.getElementById('year').textContent = new Date().getFullYear();

// Highly Optimized GSAP Animations
gsap.registerPlugin(ScrollTrigger);

function initGSAP() {
  // Hero entry animations
  gsap.fromTo(".init-anim", 
    { y: 40, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
  );

  // Parallax effect on the glass card
  gsap.to('#profile-card', {
    y: -40, 
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } 
  });

  // Smooth scroll reveals for all sections
  gsap.utils.toArray('.scroll-reveal').forEach((el) => {
    gsap.fromTo(el, 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' } 
      }
    );
  });

  // Animate skill bars
  gsap.utils.toArray('.progress-fill').forEach((bar) => {
    const targetWidth = bar.getAttribute('data-width');
    gsap.to(bar, {
      width: targetWidth, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: bar, start: 'top 90%' }
    });
  });
}

// Brand New Professional 3D "Data Globe" 
function initThreeJS() {
  const root = document.getElementById('three-root');
  if(!root) return;

  const scene = new THREE.Scene();
  let width = root.clientWidth || 400;
  let height = root.clientHeight || 500;
  
  const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
  camera.position.set(0, 0, 250); // Pulled camera back for sleek framing

  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio for high FPS
  root.appendChild(renderer.domElement);

  // The Data Nodes (Particles)
  const sphereGeo = new THREE.SphereGeometry(75, 42, 42); 
  const particleMaterial = new THREE.PointsMaterial({
    size: 1.8, 
    color: 0xc87a63, // Copper Color
    transparent: true,
    opacity: 0.8,
  });
  const dataGlobe = new THREE.Points(sphereGeo, particleMaterial);
  scene.add(dataGlobe);

  // The Inner Core (Subtle geometric wireframe)
  const innerGeo = new THREE.IcosahedronGeometry(72, 2);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xe8b4a2, // Peach Color
    wireframe: true, 
    transparent: true, 
    opacity: 0.1
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerCore);

  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(document.getElementById('hero'));

  function animate(time) {
    if (isVisible) {
      // Elegant, slow rotation perfect for a professional vibe
      dataGlobe.rotation.y += 0.002;
      dataGlobe.rotation.x = Math.sin(time / 3000) * 0.2; 
      
      innerCore.rotation.y -= 0.001;
      innerCore.rotation.z += 0.001;
      
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    if(!root.clientWidth) return;
    width = root.clientWidth; height = root.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

// Mail system
function sendMessage() {
  const name = document.getElementById('name').value || 'Recruiter';
  const email = document.getElementById('email').value || 'no-reply@example.com';
  const msg = document.getElementById('message').value || '';
  const body = `Hi Sathvika,\n\nI am ${name} (${email}).\n\n${msg}`;
  window.location.href = `mailto:kosanasathvika@gmail.com?subject=Portfolio Inquiry&body=${encodeURIComponent(body)}`;
}
