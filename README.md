```html
<body>
  <div class="banner">
    <div class="slider" style="--quantity: 10">
      <div class="item" style="--position: 1">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
      <div class="item" style="--position: 2">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
      <div class="item" style="--position: 3">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
      <div class="item" style="--position: 4">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
      <div class="item" style="--position: 5">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
      <div class="item" style="--position: 6">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
      <div class="item" style="--position: 7">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
      <div class="item" style="--position: 8">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
      <div class="item" style="--position: 9">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
      <div class="item" style="--position: 10">
        <img src="https://via.placeholder.com/200x250" alt="" />
      </div>
    </div>
  </div>
</body>
```

```css
.banner {
  width: 100%;
  height: 100vh;
  text-align: center;
  overflow: hidden;
  position: relative;
}

.banner .slider {
  position: absolute;
  width: 200px;
  height: 250px;
  top: 10%;
  left: calc(50% - 100px);
  transform-style: preserve-3d;
  transform: perspective(1000px);
  animation: autoRun 20s linear infinite;
}

@keyframes autoRun {
  from {
    transform: perspective(1000px) rotateX(-16deg) rotateY(0deg);
  }
  to {
    transform: perspective(1000px) rotateX(-16deg) rotateY(360deg);
  }
}

.banner .slider .item {
  position: absolute;
  inset: 0;
  transform: rotateY(calc((var(--position) - 1) * (360deg / var(--quantity)))) translateZ(
      550px
    );
}

.banner .slider .item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Font fmaily - Bungee Inline , Fredericka the Great , Karantina

<!-- Text Animation -->

```html
<div class="banner">
  <div class="title">
    <svg
      width="360"
      height="360"
      viewBox="0 0 15 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 7.932C3 8.268 2.896 8.54 2.688 8.748C2.48 8.948 2.208 9.048 1.872 9.048H1.368C1.032 9.048 0.76 8.948 0.552 8.748C0.344 8.54 0.24 8.268 0.24 7.932V5.424H1.38V7.872C1.38 7.912 1.4 7.932 1.44 7.932H1.8C1.84 7.932 1.86 7.912 1.86 7.872V1.716H1.38L1.476 0.599999H3V7.932ZM6.53438 7.932C6.53438 8.268 6.43038 8.54 6.22238 8.748C6.01438 8.948 5.74238 9.048 5.40638 9.048H4.66238C4.32638 9.048 4.05438 8.948 3.84638 8.748C3.63838 8.54 3.53438 8.268 3.53438 7.932V1.716H3.35438L3.47438 0.599999H4.67438V7.872C4.67438 7.912 4.69438 7.932 4.73438 7.932H5.33438C5.37438 7.932 5.39438 7.912 5.39438 7.872V0.624H6.53438V7.932ZM10.192 7.884C10.192 8.22 10.088 8.492 9.88003 8.7C9.67203 8.9 9.40003 9 9.06403 9H7.07203V1.716H6.89203L7.01203 0.599999H9.06403C9.40003 0.599999 9.67203 0.704 9.88003 0.912C10.088 1.112 10.192 1.38 10.192 1.716V7.884ZM8.99203 1.716H8.21203V7.884H8.99203C9.03203 7.884 9.05203 7.864 9.05203 7.824V1.776C9.05203 1.736 9.03203 1.716 8.99203 1.716ZM13.2483 0.599999H14.3883V9H13.2483L11.9283 3.864V9H10.7883V1.716H10.6083L10.7283 0.599999H11.9883L13.3203 5.94L13.2483 0.599999Z"
        fill="white"
      />
    </svg>
  </div>
</div>
```

```css
svg path {
  fill: transparent;
  stroke: #fff;
  stroke-width: 0.1;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: textAnimation 4s ease-in-out 1 forwards;
}

@keyframes textAnimation {
  0% {
    stroke-dashoffset: 1000;
  }
  80% {
    fill: transparent;
  }
  100% {
    stroke-dashoffset: 0;
    fill: #fff;
  }
}
```

<!-- autoShowAnimation -->

```css
.autoShow {
  animation: autoShowAnimation both;
  animation-timeline: view(70% 5%);
}
@keyframes autoShowAnimation {
  from {
    opacity: 0;
    transform: translateY(200px) scale(0.3);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

Another Option

```css
/* Initial state */
.autoShow {
  opacity: 0;
  transform: translateY(100px) scale(0.95);
  transition: all 0.6s ease-out;
  will-change: transform, opacity;
}

/* Animate in when in view */
.autoShow.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

```js
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".autoShow");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  elements.forEach((el) => observer.observe(el));
});
```

<!-- autoBlurAnimation -->

# ✅ autoBlurAnimation Production-Ready (Works Everywhere)

```css
.autoBlue2 {
  animation: autoBlurAnimation linear both;
  animation-timeline: view();
}
@keyframes autoBlurAnimation {
  0% {
    filter: blur(40px);
  }
  45%,
  55% {
    filter: blur(0);
  }
  100% {
    filter: blur(40px);
  }
}
```

# ✅ Production-Ready Alternative (Works Everywhere)

```css
.autoBlue {
  filter: blur(40px);
  transition: filter 0.8s ease-in-out;
}

.autoBlue.inView {
  filter: blur(0px);
}
```

```js
const blurElements = document.querySelectorAll(".autoBlue");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("inView");
        // Uncomment to blur again when out of view
        // observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.3,
  }
);

blurElements.forEach((el) => observer.observe(el));
```
