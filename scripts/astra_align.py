import bpy
import numpy as np
from mathutils import Matrix, Vector


def freeze(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)


def axle_of(obj):
    coords = np.array([(vert.co.x, vert.co.y, vert.co.z) for vert in obj.data.vertices], dtype=np.float64)
    center = coords.mean(axis=0)
    rel = coords - center
    _vals, vecs = np.linalg.eigh(rel.T @ rel)
    axis = vecs[:, 0]
    if axis[0] < 0.0:
        axis = -axis
    return Vector(axis)


def peel_caliper(obj, name):
    slots = [index for index, slot in enumerate(obj.material_slots) if slot.material and slot.material.name == "calipers"]
    if not slots:
        print(name, "missing")
        return
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="DESELECT")
    bpy.ops.object.mode_set(mode="OBJECT")
    picked = 0
    for poly in obj.data.polygons:
        if poly.material_index in slots:
            poly.select = True
            picked += 1
    if picked == 0:
        print(name, "empty")
        return
    before = set(bpy.data.objects)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.separate(type="SELECTED")
    bpy.ops.object.mode_set(mode="OBJECT")
    for created in bpy.data.objects:
        if created not in before:
            created.name = name
            print(name, "verts", len(created.data.vertices))


def straighten(obj, center):
    axis = axle_of(obj)
    up = Vector((0.0, 0.0, 1.0))
    y_axis = up.cross(axis)
    if y_axis.length < 1e-6:
        y_axis = Vector((0.0, 1.0, 0.0)).cross(axis)
    y_axis.normalize()
    z_axis = axis.cross(y_axis).normalized()
    rotation = Matrix((axis, y_axis, z_axis))
    for vert in obj.data.vertices:
        vert.co = center + rotation @ (vert.co - center)
    obj.data.update()
    return axis


def align_wheels(wheels):
    for wheel in wheels:
        center = wheel["center"]
        parts = [part for part in wheel["parts"] if part.name in bpy.data.objects]
        for part in parts:
            freeze(part)
        bpy.ops.object.select_all(action="DESELECT")
        for part in parts:
            part.select_set(True)
        bpy.context.view_layer.objects.active = parts[0]
        if len(parts) > 1:
            bpy.ops.object.join()
        joined = bpy.context.view_layer.objects.active
        before = straighten(joined, center)
        bpy.context.scene.cursor.location = center
        bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
        side = "R" if center.x >= 0.0 else "L"
        axle = "F" if center.y >= 0.0 else "B"
        joined.name = f"Wheel_{side}{axle}"
        peel_caliper(joined, f"Caliper_{side}{axle}")
        after = axle_of(joined)
        corners = [joined.matrix_world @ Vector(corner) for corner in joined.bound_box]
        size = Vector((
            max(corner.x for corner in corners) - min(corner.x for corner in corners),
            max(corner.y for corner in corners) - min(corner.y for corner in corners),
            max(corner.z for corner in corners) - min(corner.z for corner in corners),
        ))
        print(
            joined.name,
            "verts",
            len(joined.data.vertices),
            "was",
            tuple(round(v, 3) for v in before),
            "now",
            tuple(round(v, 3) for v in after),
            "size",
            tuple(round(v, 1) for v in size),
        )
