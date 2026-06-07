const lucide = require('lucide-react');
const icons = ['GalleryHorizontal', 'GalleryVertical', 'MonitorPlay', 'PictureInPicture', 'Menu', 'GripHorizontal', 'List', 'AlignLeft'];

icons.forEach(icon => {
  if (lucide[icon] === undefined) {
    console.log(icon, 'is undefined');
  } else {
    console.log(icon, 'is available');
  }
});
