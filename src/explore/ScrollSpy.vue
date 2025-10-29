<template>
  <div class="scrollspy" ref="scrollSpyContainer">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';

// Props
const props = defineProps({
  activeClass: {
    type: String,
    default: 'active'
  },
  offset: {
    type: Number,
    default: 80
  },
  duration: {
    type: Number,
    default: 600
  },
  scrollContainerSelector: {
    type: String,
    required: true
  },
  threshold: {
    type: Array,
    default: () => [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  },
  rootMargin: {
    type: String,
    default: '-80px 0px -50% 0px'
  }
});

// Emits
const emit = defineEmits(['itemchanged']);

// State
const scrollSpyContainer = ref(null);
const activeItem = ref(null);
const items = ref(new Map());
const observer = ref(null);
const isTrackingScroll = ref(false);

// Computed
const scrollElement = computed(() => {
  const element = document.querySelector(props.scrollContainerSelector);
  if (!element) {
    console.warn(
      `ScrollSpy: Container "${props.scrollContainerSelector}" not found`
    );
  }
  return element;
});

// Scroll Element Registration
const registerItem = (menuElement, sectionElement) => {
  if (!menuElement || !sectionElement) {
    console.warn('ScrollSpy: Invalid menu or section element');
    return;
  }

  items.value.set(menuElement, sectionElement);
  menuElement.addEventListener('click', handleItemClick);

  // Add accessibility attributes
  menuElement.setAttribute('aria-current', 'false');
  menuElement.setAttribute('role', 'button');

  if (observer.value) {
    observer.value.observe(sectionElement);
  }
};

const autoRegisterItems = () => {
  if (!scrollSpyContainer.value) {
    console.warn('ScrollSpy: Container not found');
    return;
  }

  const menuItems =
    scrollSpyContainer.value.querySelectorAll('.scrollspy-item');

  if (menuItems.length === 0) {
    console.warn('ScrollSpy: No .scrollspy-item elements found');
    return;
  }

  menuItems.forEach((item) => {
    const target =
      item.getAttribute('href') || item.getAttribute('data-target');
    if (target) {
      let section;
      if (target.startsWith('#')) {
        section = document.getElementById(target.slice(1));
      } else {
        section = document.querySelector(target);
      }

      if (section) {
        registerItem(item, section);
      } else {
        console.warn(`ScrollSpy: Target element not found for "${target}"`);
      }
    } else {
      console.warn(
        'ScrollSpy: Menu item missing href or data-target attribute',
        item
      );
    }
  });
};

// Initialise scroll spy
const initScrollSpy = () => {
  if (!scrollElement.value) {
    console.warn('ScrollSpy: Scroll element not available');
    return;
  }

  if (observer.value) {
    observer.value.disconnect();
  }

  // Use custom rootMargin from props or generate from offset
  const rootMargin = props.rootMargin || `-${props.offset}px 0px -50% 0px`;

  observer.value = new IntersectionObserver(
    (entries) => {
      if (isTrackingScroll.value) return;

      let mostVisibleItem = null;
      let highestRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
          highestRatio = entry.intersectionRatio;

          for (const [menuElement, section] of items.value.entries()) {
            if (section === entry.target) {
              mostVisibleItem = menuElement;
              break;
            }
          }
        }
      });

      if (mostVisibleItem && mostVisibleItem !== activeItem.value) {
        updateActiveItem(mostVisibleItem, 'scroll');
      }
    },
    {
      root: scrollElement.value,
      rootMargin: rootMargin,
      threshold: props.threshold
    }
  );

  // Observe all sections
  items.value.forEach((section) => {
    observer.value.observe(section);
  });
};

const updateActiveItem = (newItem, type = 'unknown') => {
  // Remove active class and aria from previous
  if (activeItem.value) {
    activeItem.value.classList.remove(props.activeClass);
    activeItem.value.setAttribute('aria-current', 'false');
  }

  // Add to new item
  newItem.classList.add(props.activeClass);
  newItem.setAttribute('aria-current', 'true');
  activeItem.value = newItem;

  emit('itemchanged', { type, currentItem: newItem });
};

// Add smooth scrolling
const smoothScrollTo = (element) => {
  return new Promise((resolve) => {
    if (!scrollElement.value || !element) {
      resolve();
      return;
    }

    let targetOffset;
    if (scrollElement.value === window) {
      const rect = element.getBoundingClientRect();
      targetOffset = rect.top + window.pageYOffset - props.offset;
    } else {
      targetOffset = element.offsetTop - props.offset;
    }

    const startPosition =
      scrollElement.value === window
        ? window.pageYOffset
        : scrollElement.value.scrollTop;
    const distance = targetOffset - startPosition;

    let startTime = null;
    isTrackingScroll.value = true;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;

      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / props.duration, 1);
      const easeProgress = easeOutCubic(progress);

      const currentPosition = startPosition + distance * easeProgress;

      if (scrollElement.value === window) {
        window.scrollTo(0, currentPosition);
      } else {
        scrollElement.value.scrollTop = currentPosition;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isTrackingScroll.value = false;
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
};

// Scroll to section on load if hash present
const scrollOnLoad = () => {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  const section = document.getElementById(hash);
  if (!section) return;
  // Wait a bit longer to ensure everything is rendered and registered
  setTimeout(() => {
    smoothScrollTo(section);
  }, 150);
};

// Click handler
const handleItemClick = (event) => {
  event.preventDefault();

  const menuElement = event.currentTarget;
  const sectionElement = items.value.get(menuElement);

  if (!sectionElement) {
    console.warn('ScrollSpy: No section element found for menu item');
    return;
  }

  // Temporarily disable scroll spy during scroll
  if (observer.value) {
    observer.value.disconnect();
  }

  // Immediately activate clicked item
  updateActiveItem(menuElement, 'click');

  // Smooth scroll to section
  smoothScrollTo(sectionElement).then(() => {
    // Re-enable scroll spy
    initScrollSpy();

    // Update URL hash
    if (sectionElement.id) {
      window.history.pushState(null, '', `#${sectionElement.id}`);
    }
  });
};

// Vue lifecycle hooks
onMounted(() => {
  nextTick(() => {
    autoRegisterItems();
    initScrollSpy();
    scrollOnLoad();
  });
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }

  // Clean up event listeners
  items.value.forEach((section, menuElement) => {
    menuElement.removeEventListener('click', handleItemClick);
  });
});
</script>
