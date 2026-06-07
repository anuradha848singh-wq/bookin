const lucide = require('lucide-react');
const icons = ['Search', 'X', 'Square', 'Columns', 'LayoutGrid', 'Layers', 'Type', 'Heading1', 'MousePointerClick', 'Image', 'Smile', 'Minus', 'Space', 'Video', 'Images', 'SlidersHorizontal', 'FormInput', 'MapPin', 'Table', 'AlignJustify', 'ListCollapse', 'ToggleLeft', 'CalendarDays', 'ConciergeBell', 'Clock', 'Users', 'Repeat', 'Baseline', 'List', 'CreditCard', 'Code2'];

icons.forEach(icon => {
  if (lucide[icon] === undefined) {
    console.log(icon, 'is undefined');
  }
});
