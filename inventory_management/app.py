from flask import Flask, request, render_template, jsonify
import csv
import os
from datetime import datetime
import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
from io import BytesIO
import base64

app = Flask(__name__)

CSV_FILE = 'inventorydata.csv'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-inventory-data')
def get_inventory_data():
    try:
        with open(CSV_FILE, 'r') as file:
            reader = csv.DictReader(file)
            inventory = list(reader)
        return jsonify(inventory)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-inventory', methods=['POST'])
def add_inventory():
    try:
        data = request.json
        file_exists = os.path.exists(CSV_FILE)
        
        if not file_exists:
            with open(CSV_FILE, 'w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([
                    'Product Name',
                    'Quantity',
                    'Expiry Date',
                    'Monthly Consumption',
                    'Donated to NGO',
                    'Waste'
                ])
        
        with open(CSV_FILE, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                data['Product Name'],
                data['Quantity'],
                data['Expiry Date'],
                data['Monthly Consumption'],
                data['Donated to NGO'],
                data['Waste']
            ])
        
        return jsonify({"status": "success", "message": "Inventory added successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/inventory-pie-chart')
def inventory_pie_chart():
    try:
        df = pd.read_csv(CSV_FILE)
        waste_data = df['Waste'].astype(float)
        labels = df['Product Name']
        
        plt.figure(figsize=(6, 6))
        plt.pie(waste_data, labels=labels, autopct='%1.1f%%')
        plt.title('Inventory Waste Distribution')
        
        # Save to a buffer
        buf = BytesIO()
        plt.savefig(buf, format="png")
        plt.close()
        buf.seek(0)
        
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        buf.close()
        
        return jsonify({"status": "success", "image": image_base64})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/predict-reduction', methods=['POST'])
def predict_reduction():
    try:
        df = pd.read_csv(CSV_FILE)
        df = df.dropna()
        X = df[['Quantity']].astype(float)
        y = df['Waste'].astype(float)

        model = LinearRegression()
        model.fit(X, y)

        data = request.json
        current_quantity = float(data['Quantity'])
        
        predicted_waste = model.predict([[current_quantity]])[0]
        suggested_reduction = current_quantity * 0.9 if predicted_waste > 0 else current_quantity

        return jsonify({
            "status": "success",
            "suggested_quantity": suggested_reduction,
            "predicted_waste": predicted_waste
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
