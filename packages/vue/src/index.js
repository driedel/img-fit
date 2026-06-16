import { h, ref, onMounted, onUnmounted } from 'vue';
import ImgFitCore from '@danilo.riedel/img-fit';

/**
 * Vue component that renders an optimized <img> for img-fwd.
 *
 * @param {object} props
 * @param {string} props.src
 * @param {string} [props.alt]
 * @param {string} [props.params]
 * @param {object} [props.options]
 */
export const ImgFit = {
  name: 'ImgFit',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    params: { type: String, default: '' },
    options: { type: Object, default: () => ({}) }
  },
  setup(props, { attrs }) {
    const imgRef = ref(null);

    onMounted(() => {
      const element = imgRef.value;
      if (!element) {
        return;
      }

      element.setAttribute('data-img-fit', props.src);
      if (props.params) {
        element.setAttribute('data-img-fit-params', props.params);
      }

      ImgFitCore.watch(element, props.options);
    });

    onUnmounted(() => {
      if (imgRef.value) {
        ImgFitCore.unwatch(imgRef.value);
      }
    });

    return () =>
      h('img', {
        ref: imgRef,
        src: props.src,
        alt: props.alt,
        'data-img-fit': props.src,
        'data-img-fit-params': props.params || undefined,
        ...attrs
      });
  }
};

export default ImgFit;
