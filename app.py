from flask import Flask, render_template, request, jsonify, send_file
from sqlalchemy import Float, create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import pandas as pd
from openpyxl import Workbook
from openpyxl.drawing.image import Image
from openpyxl.styles import Font
import os

app = Flask(__name__)

# Database setup
engine = create_engine('sqlite:///AlumnosTB.db', echo=True)
Base = declarative_base()
Session = sessionmaker(bind=engine)

class Alumno(Base):
    __tablename__ = 'alumnos'
    id = Column(Integer, primary_key=True)
    apaterno = Column(String(50), nullable=False)
    apmaterno = Column(String(50), nullable=False)
    nombre = Column(String(50), nullable=False)
    fbday = Column(Date, nullable=False)
    curp = Column(String(18), unique=True, nullable=False)
    calle = Column(String(100), nullable=False)
    numero = Column(String(10), nullable=False)
    colonia = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    telefono = Column(String(15), nullable=False)
    numafiliacion = Column(String(20), unique=True, nullable=False)
    estatus = Column(String(10), nullable=False)
    pagos = relationship("Pago", back_populates="alumno")

class Pago(Base):
    __tablename__ = 'pagos'
    id = Column(Integer, primary_key=True)
    alumno_id = Column(Integer, ForeignKey('alumnos.id'))
    fecha = Column(Date, nullable=False)
    monto = Column(Float, nullable=False)
    concepto = Column(String(100), nullable=False)
    alumno = relationship("Alumno", back_populates="pagos")

Base.metadata.create_all(engine)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/')
def registro_pagos():
    return render_template('registro_pagos.html')

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        session = Session()
        try:
            nuevo_alumno = Alumno(
                apaterno=request.form['apaterno'],
                apmaterno=request.form['apmaterno'],
                nombre=request.form['nombre'],
                fbday=datetime.strptime(request.form['fbday'], '%Y-%m-%d').date(),
                curp=request.form['curp'],
                calle=request.form['calle'],
                numero=request.form['numero'],
                colonia=request.form['colonia'],
                email=request.form['email'],
                telefono=request.form['telefono'],
                numafiliacion=request.form['numafiliacion'],
                estatus=request.form['estatus']
            )
            session.add(nuevo_alumno)
            session.commit()
            return jsonify({"success": True, "message": "Alumno registrado correctamente"})
        except Exception as e:
            session.rollback()
            return jsonify({"success": False, "message": f"Error: {str(e)}"})
        finally:
            session.close()
    return render_template('registro.html')

@app.route('/alumnos')
def lista_alumnos():
    session = Session()
    try:
        alumnos = session.query(Alumno).all()
        return render_template('lista_alumnos.html', alumnos=alumnos)
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        session.close()

@app.route('/alumno/<int:id>', methods=['GET', 'POST'])
def detalle_alumno(id):
    session = Session()
    try:
        alumno = session.query(Alumno).get(id)
        if request.method == 'POST':
            alumno.apaterno = request.form['apaterno']
            alumno.apmaterno = request.form['apmaterno']
            alumno.nombre = request.form['nombre']
            alumno.fbday = datetime.strptime(request.form['fbday'], '%Y-%m-%d').date()
            alumno.curp = request.form['curp']
            alumno.calle = request.form['calle']
            alumno.numero = request.form['numero']
            alumno.colonia = request.form['colonia']
            alumno.email = request.form['email']
            alumno.telefono = request.form['telefono']
            alumno.numafiliacion = request.form['numafiliacion']
            alumno.estatus = request.form['estatus']
            session.commit()
            return jsonify({"success": True, "message": "Alumno actualizado correctamente"})
        return render_template('detalle_alumno.html', alumno=alumno)
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "message": f"Error: {str(e)}"})
    finally:
        session.close()

@app.route('/eliminar_alumno/<int:id>', methods=['POST'])
def eliminar_alumno(id):
    session = Session()
    try:
        alumno = session.query(Alumno).get(id)
        session.delete(alumno)
        session.commit()
        return jsonify({"success": True, "message": "Alumno eliminado correctamente"})
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "message": f"Error: {str(e)}"})
    finally:
        session.close()

@app.route('/registrar_pago/<int:alumno_id>', methods=['POST'])
def registrar_pago(alumno_id):
    session = Session()
    try:
        nuevo_pago = Pago(
            alumno_id=alumno_id,
            fecha=datetime.strptime(request.form['fecha'], '%Y-%m-%d').date(),
            monto=float(request.form['monto']),
            concepto=request.form['concepto']
        )
        session.add(nuevo_pago)
        session.commit()
        return jsonify({"success": True, "message": "Pago registrado correctamente"})
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "message": f"Error: {str(e)}"})
    finally:
        session.close()

@app.route('/generar_reporte')
def generar_reporte():
    session = Session()
    try:
        alumnos = session.query(Alumno).filter(Alumno.estatus == "activo").all()
        df = pd.DataFrame([
            {
               'No': a.id,
               'Apellido Paterno': a.apaterno,
               'Apellido Materno': a.apmaterno,
               'Nombre': a.nombre,
               'Fecha de Nacimiento': a.fbday,
               'CURP': a.curp,
               'Calle': a.calle,
               'Número': a.numero,
               'Colonia': a.colonia,
               'Email': a.email,
               'Teléfono': a.telefono,
               'Número de Afiliación': a.numafiliacion
            } for a in alumnos
        ])

        wb = Workbook()
        ws = wb.active
        ws.title = "Reporte de Alumnos"

        headers = ["No", "Apellido Paterno", "Apellido Materno", "Nombre", "Fecha de Nacimiento", "Curp",
                    "Calle","Número","Colonia","E-Mail","Teléfono","Número de Afiliacion"]

        img = Image('static/img/logo_excl.png')
        ws.add_image(img, 'A1')

        ws['A8'] = ""
        ws.append(headers) 
        
        for r in pd.DataFrame(df).itertuples():
            ws.append(r[1:])

        filename = f"Reporte_Alumnos_{datetime.now().strftime('%Y%m%d')}.xlsx"
        wb.save(filename)

        return send_file(filename, as_attachment=True)
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')