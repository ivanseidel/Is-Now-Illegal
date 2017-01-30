import sys
import cv2
import json
import numpy as np

# Rotoscope function. Pass in the:
# - Destination image
# - Image to be warped
# - Rotoscpoe object with 'corners' and 'show' properties
def rotoscope(dst, warp, properties):
	if properties['show'] == False:
		return

	corners = properties['corners']

	rows, cols, ch = dst.shape

	pts1 = np.float32([[0, 0],[warp.shape[1], 0],[0, warp.shape[0]]])
	pts2 = np.float32(corners)

	M = cv2.getAffineTransform(pts1,pts2)
	cv2.warpAffine(warp, M, (cols,rows), dst, cv2.INTER_AREA, borderMode=cv2.BORDER_TRANSPARENT)