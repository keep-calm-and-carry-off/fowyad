import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))
from astra_align import align_wheels
from astra_wheels import collect_wheels

SRC = r"C:\rzserver\fowyad\public\models\opel-astra-gtc.glb"
DST = r"C:\rzserver\fowyad\public\models\astra-black.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)

base = bpy.data.objects.get("Object_76")
if base is not None:
    bpy.data.objects.remove(base, do_unlink=True)

mat = bpy.data.materials.get("bodypaint")
if mat and mat.use_nodes:
    for node in mat.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            node.inputs["Base Color"].default_value = (0.012, 0.012, 0.013, 1.0)
            node.inputs["Metallic"].default_value = 0.62
            node.inputs["Roughness"].default_value = 0.3

align_wheels(collect_wheels())
bpy.ops.export_scene.gltf(filepath=DST, export_format="GLB", export_yup=True)
print("EXPORTED", DST)
