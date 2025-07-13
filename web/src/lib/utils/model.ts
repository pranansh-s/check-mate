import { Box3, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three';

export const createColoredModel = (source: Object3D, color: string) => {
  const clone = source.clone();

  const boundingBox = new Box3().setFromObject(clone);
  const size = new Vector3();
  const center = new Vector3();

  boundingBox.getSize(size);
  boundingBox.getCenter(center);

  const verticalOffset = new Vector3(-(center.x / size.x) * 5, -(center.y / size.y) * 9, 0);

  clone.traverse(child => {
    if (child instanceof Mesh) {
      const geometry = child.geometry.clone();
      geometry.translate(verticalOffset.x, verticalOffset.y, verticalOffset.z);

      child.geometry = geometry;
      child.material = new MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.3,
      });
    }
  });

  return clone;
};
