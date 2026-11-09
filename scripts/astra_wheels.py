import bpy
from mathutils import Vector

RADIUS = 54.0
WHEEL_MATS = {"rubber_masks", "aluminum", "calipers", "black_paint"}


def separate_loose(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    before = set(bpy.data.objects)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.separate(type="LOOSE")
    bpy.ops.object.mode_set(mode="OBJECT")
    created = [item for item in bpy.data.objects if item not in before]
    return [obj] + created


def world_points(obj):
    mw = obj.matrix_world
    return [mw @ vert.co for vert in obj.data.vertices]


def materials_of(obj):
    return [slot.material.name for slot in obj.material_slots if slot.material]


def cluster_discs(discs):
    wheels = []
    for disc in discs:
        pts = world_points(disc)
        center = sum(pts, Vector()) / len(pts)
        match = None
        for wheel in wheels:
            if (center - wheel["center"]).length < 30.0:
                match = wheel
                break
        if match is None:
            wheels.append({"center": center, "parts": [disc]})
            continue
        total = len(match["parts"])
        match["center"] = (match["center"] * total + center) / (total + 1)
        match["parts"].append(disc)
    return wheels


def is_wheel_donor(obj):
    if obj.type != "MESH":
        return False
    names = materials_of(obj)
    if not names or not any(name in WHEEL_MATS for name in names):
        return False
    if "brake_disk" in names:
        return False
    pts = world_points(obj)
    center = sum(pts, Vector()) / len(pts)
    return center.z < 90.0


def harvest_parts(wheels):
    donors = [obj for obj in list(bpy.data.objects) if is_wheel_donor(obj)]
    print("DONORS", [(obj.name, materials_of(obj), len(obj.data.vertices)) for obj in donors])

    for donor in donors:
        for wheel in wheels:
            obj = bpy.data.objects.get(donor.name)
            if obj is None or obj.type != "MESH" or len(obj.data.vertices) < 40:
                break
            bpy.ops.object.select_all(action="DESELECT")
            obj.select_set(True)
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.mode_set(mode="EDIT")
            bpy.ops.mesh.select_all(action="DESELECT")
            bpy.ops.object.mode_set(mode="OBJECT")
            picked = 0
            mw = obj.matrix_world
            center = wheel["center"]
            for vert in obj.data.vertices:
                if (mw @ vert.co - center).length <= RADIUS:
                    vert.select = True
                    picked += 1
            if picked < 40:
                continue
            if picked >= len(obj.data.vertices) - 10:
                obj.name = "WheelPart"
                wheel["parts"].append(obj)
                break
            before = set(bpy.data.objects)
            bpy.ops.object.mode_set(mode="EDIT")
            bpy.ops.mesh.separate(type="SELECTED")
            bpy.ops.object.mode_set(mode="OBJECT")
            for created in bpy.data.objects:
                if created not in before:
                    created.name = "WheelPart"
                    wheel["parts"].append(created)


def collect_wheels():
    discs = separate_loose(bpy.data.objects["Object_62"])
    wheels = cluster_discs(discs)
    harvest_parts(wheels)
    return wheels
