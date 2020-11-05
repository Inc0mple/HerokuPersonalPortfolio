from SimpleHigherHRNet import SimpleHigherHRNet
import sys

model = None

def initialiseModel():
    global model
    model = SimpleHigherHRNet(32, 17, "./pythonCV/weights/pose_higher_hrnet_w32_512.pth")
    return model
    sys.stdout.flush()

initialiseModel()