import os
import pandas as pd
from dotenv import load_dotenv
from database import supabase

# .env dosyasını yükle (Supabase anahtarlarını okumak için)
load_dotenv()

# ==============================================================
# ⚙️  CSV → Supabase yükleme scripti
# ==============================================================

def upload_csv_to_supabase(csv_path: str, table_name: str):
    if not supabase:
        print("❌ Supabase bağlantısı başlatılamadı. Lütfen .env dosyasını kontrol et.")
        return

    # Dosya kontrolü
    if not os.path.exists(csv_path):
        print(f"❌ CSV dosyası bulunamadı: {csv_path}")
        return

    # CSV oku
    df = pd.read_csv(csv_path)

    # Gereksiz boşlukları temizle
    df.columns = [col.strip() for col in df.columns]
    df = df.fillna("")

    # DataFrame’i JSON’a dönüştür
    records = df.to_dict(orient="records")

    print(f"📦 {len(records)} satır yüklenecek → {table_name} tablosu")

    try:
        response = supabase.table(table_name).insert(records).execute()
        if hasattr(response, "data"):
            print(f"✅ Yükleme tamamlandı. {len(records)} satır eklendi.")
        else:
            print("⚠️ API yanıtı beklenmedik formatta:", response)
    except Exception as e:
        print("❌ Yükleme sırasında hata oluştu:", e)


# ==============================================================
# 🚀  Ana Çalıştırma Bloğu
# ==============================================================

if __name__ == "__main__":
    # CSV dosya yolu (proje yapısına göre ayarlayabilirsin)
    csv_path = os.path.join("data", "base_work_items.csv")

    # Supabase tablo adı
    table_name = "work_items"

    upload_csv_to_supabase(csv_path, table_name)
