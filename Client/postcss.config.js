// postcss.config.js
export default {
  plugins: {
    // Plugin chính của Tailwind CSS
    tailwindcss: {},
    // Tự động thêm prefix cho các thuộc tính CSS (ví dụ: -webkit-, -moz-…)
    autoprefixer: {},
    // Nếu bạn muốn nén CSS khi build production, có thể thêm:
    // 'cssnano': { preset: 'default' }
  }
};
