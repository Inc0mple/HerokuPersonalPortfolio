print("python script now running!!")

print("starting imports")
import cv2
print("imported cv2")
import sys
print("imported sys")
from SimpleHigherHRNet import SimpleHigherHRNet
print("imported SimpleHigherHRNet")
from misc.visualization import draw_points, draw_points_and_skeleton
print("imported misc.visualization")
import numpy as np
print("imported numpy")
import matplotlib.pyplot as plt
print("imported plt")
import torch
print("imported torch")
from PIL import Image, ImageChops
print("imported PIL")

skeleton = [[15, 13], [13, 11], [16, 14], [14, 12], [11, 12], [5, 11], [6, 12], [5, 6], [5, 7], [6, 8], [7, 9], [8, 10], [1, 2], [0, 1], [0, 2], [1, 3], [2, 4]]
model = SimpleHigherHRNet(32, 17, "./pythonCV/weights/pose_higher_hrnet_w32_512.pth")
print("model initiated")

def processImage(inputImg):
    image = cv2.imread(inputImg, cv2.IMREAD_COLOR)

    #From StackOverflow: OpenCV likes to treat images as BGR instead of RGB. Adding image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) will swap layers (back to normal)

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    joints = model.predict(image)

    if not joints.size > 0:
        print("No person detected")
        return

    #Draws points and skeletons for each set of detections by the model
    for idx,val in enumerate(joints):
        joints_and_skeleton = draw_points_and_skeleton(image, joints[idx], skeleton, points_color_palette='tab20', points_palette_samples=16,skeleton_color_palette='Set2', skeleton_palette_samples=8, person_index=idx,confidence_threshold=0.2)
    pilImg = Image.fromarray(joints_and_skeleton, 'RGB')
    
    try:
        pilImg.save("uploads/processedImage.png")
    except:
        print("unable to save pilImg")
    print("Python processing done")
    return


processImage(sys.argv[1])
