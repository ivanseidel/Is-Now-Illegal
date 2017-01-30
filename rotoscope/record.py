import os
import sys
import cv2
import json
import copy
import time
import numpy as np

from os import listdir
from os.path import isfile, join

# Our API
from rotoscope import rotoscope

# Given an image name, finds the index inside the json
def lookForImageInJSON(json, image):
	index = 0
	for frame in json:
		if frame['file'] == image:
			return index
		index = index + 1

	return None
# ====================================================


# Converts an array to tuple
def totuple(a):
    try:
        return tuple(totuple(i) for i in a)
    except TypeError:
        return a
# ====================================================

# Reads the path from cmd
if len(sys.argv) != 3:
	print("Usage: python record.py <path-to-folder> <in-out-json>")
	exit()
path = sys.argv[1]
jsonPath = join(path, sys.argv[2])

# State variables
currentCorner = 0
imageIndex = 0
lastClick = None
endKeys = [113, 27]

# Image to be rotoscopied
textSize = 100, 80, 3
# text = np.zeros(textSize, dtype=np.uint8)
text = cv2.imread('text.png')

# Load Json
jsonFrames = json.load(open(jsonPath))

# Get list of all files
images = [f for f in listdir(path) if isfile(join(path, f)) and f.endswith('png')]

# Show window
cv2.namedWindow('view')

# Adds the click callback
def clickCallback(event, x, y, flags, param):
	global lastClick
	if event == cv2.EVENT_LBUTTONDOWN:
		lastClick = [x, y]

cv2.setMouseCallback('view', clickCallback) 

# Start UI Loop (Ends with any of the endKeys)
key = -1
while(not key in endKeys):
	# Image name
	imageName = images[imageIndex]
	print(imageName)

	# Find image in json
	imageDataIndex = lookForImageInJSON(jsonFrames, imageName)

	# ================================
	# Initialize data if none found
	if imageDataIndex == None:
		previousData = {
			'corners': [[0, 0], [0, 0], [0, 0]],
			'show': False
		}

		if imageIndex > 0:
			lastIndex = lookForImageInJSON(jsonFrames, images[imageIndex - 1])
			if lastIndex != None:
				previousData = jsonFrames[lastIndex]
				print("Found previous! Using it...")
				print(previousData['corners'])


		jsonFrames.append({
			'file': imageName,
			'show': previousData['show'],
			'corners': copy.deepcopy(previousData['corners']),
		})

		# Force reloading
		key = 0
		continue
	# ================================

	# Load image from JSON
	imageData = jsonFrames[imageDataIndex]

	# Load image
	imagePath = os.path.join(path, imageName)
	image = cv2.imread(imagePath)

	# Apply Rotoscope
	rotoscope(image, text, imageData)

	# Render corners
	corners = imageData['corners']
	for c in range(3):
		color = (30, 255, 30) if c == currentCorner else (200, 200, 200)
		if imageData['show'] == False:
			color = (150, 150, 150)
		cv2.circle(image, totuple(corners[c]), 2, color, 2)
	
	# Show image
	cv2.imshow('view', image)

	# Wait user action
	key = -1
	while(key < 0 and lastClick == None):
		key = cv2.waitKey(50)

	# Wait key release
	# while(cv2.waitKey(10) > 0):
	# 	continue

	print(key, lastClick)

	# Check if next/previous image
	if key == 93:
		imageIndex = imageIndex + 1
		imageIndex = min(len(images) - 1, imageIndex)
		time.sleep(0.1)
	elif key == 91:
		imageIndex = imageIndex - 1
		imageIndex = max(0, imageIndex)
		time.sleep(0.1)
	elif key == 49: # key: 1
		currentCorner = 0
	elif key == 50: # key: 2
		currentCorner = 1
	elif key == 51: # key: 3
		currentCorner = 2
	elif key == 115: # key: s (show/noShow)
		imageData['show'] = not imageData['show']
	elif key == 0: # key UP
		imageData['corners'][currentCorner][1] -= 1
	elif key == 1: # key DOWN
		imageData['corners'][currentCorner][1] += 1
	elif key == 2: # key LEFT
		imageData['corners'][currentCorner][0] -= 1
	elif key == 3: # key RIGHT
		imageData['corners'][currentCorner][0] += 1
	elif lastClick != None: 
		# Change current corner position
		imageData['corners'][currentCorner] = lastClick
		

	lastClick = None


# Save json
with open(jsonPath, 'w') as outfile:
    json.dump(jsonFrames, outfile)