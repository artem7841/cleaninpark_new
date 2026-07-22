import { useEffect, useState } from "react";
import React from "react";
import { useParams, Link } from "react-router-dom";
import SimpleSlider from "./SimpleSlider";


const ServiceDetail = () => {
  const { serviceId } = useParams();
  const [servicesData, setServicesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch("/serviceData.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setServicesData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading service data:", error);
        setLoading(false);
      });
  }, [serviceId]);

  if (loading) {
    return (
      <div
        style={{
          padding: "100px 20px",
          textAlign: "center",
          backgroundColor: "white",
          minHeight: "100vh",
        }}
      >
        <div style={{ fontSize: "18px", color: "#666" }}>
          Загрузка данных...
        </div>
      </div>
    );
  }

  if (!servicesData) {
    return (
      <div
        style={{
          padding: "100px 20px",
          textAlign: "center",
          backgroundColor: "white",
          minHeight: "100vh",
        }}
      >
        <h2>Ошибка загрузки данных</h2>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Не удалось загрузить информацию об услугах
        </p>
        <Link to="/" style={{ color: "#10b981", textDecoration: "none" }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const service = servicesData[serviceId];

  if (!service) {
    return (
      <div
        style={{
          padding: "100px 20px",
          textAlign: "center",
          backgroundColor: "white",
          minHeight: "100vh",
        }}
      >
        <h2>Услуга не найдена</h2>
        <Link to="/" style={{ color: "#10b981", textDecoration: "none" }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <div
        style={{
          padding: "60px 20px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#10b981",
            textDecoration: "none",
            marginBottom: "20px",
            display: "inline-block",
          }}
        >
          ← Назад к услугам
        </Link>

        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: "700",
            marginBottom: "15px",
            lineHeight: "1.2",
          }}
        >
          {service.title}
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2vw, 18px)",
            color: "#666",
            marginBottom: "25px",
            fontStyle: "italic",
          }}
        >
          {service.subtitle}
        </p>

        <div
          style={{
            backgroundColor: "#10b981",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            display: "inline-block",
            marginBottom: "30px",
            fontWeight: "600",
          }}
        >
          {service.price}
        </div>

        {/* Основное описание */}
        <div
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "40px",
            padding: "25px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
          }}
        >
          {service.description}
        </div>

        <SimpleSlider
          images={service.images ? service.images.map(img => `/images/serv_info/${img}`) : []}
        />


        {/* Секции с что входит */}
        {service.sections &&
          service.sections.map((section, index) => (
            <div key={index} style={{ marginBottom: "40px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "10px",
                  color: "#1a1a1a",
                }}
              >
                {section.title}
              </h3>

              {section.subtitle && (
                <p
                  style={{
                    color: "#666",
                    marginBottom: "20px",
                    fontStyle: "italic",
                  }}
                >
                  {section.subtitle}
                </p>
              )}

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    style={{
                      marginBottom: "12px",
                      paddingLeft: "20px",
                      position: "relative",
                      fontSize: "15px",
                      lineHeight: "1.5",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        color: "#10b981",
                        fontWeight: "bold",
                      }}
                    >
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        {/* Таблица сравнения (только для офисной уборки) */}
        {service.comparisonTable && (
          <div
            style={{
              marginTop: "50px",
              padding: "30px",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "600",
                marginBottom: "25px",
                color: "#1a1a1a",
                textAlign: "center",
              }}
            >
              {service.comparisonTable.title}
            </h3>

            <div
              style={{
                overflowX: "auto",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#10b981" }}>
                    {service.comparisonTable.headers.map((header, index) => (
                      <th
                        key={index}
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          color: "white",
                          fontWeight: "600",
                          border: "1px solid #059669",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {service.comparisonTable.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      style={{
                        backgroundColor:
                          rowIndex % 2 === 0 ? "white" : "#f0fdf4",
                      }}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            padding: "14px",
                            border: "1px solid #e5e7eb",
                            fontSize: "14px",
                            lineHeight: "1.4",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Преимущества */}
        {service.advantages && (
          <div
            style={{
              marginTop: "50px",
              padding: "30px",
              backgroundColor: "#f0fdf4",
              borderRadius: "12px",
              border: "1px solid #dcfce7",
            }}
          >
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "600",
                marginBottom: "20px",
                color: "#1a1a1a",
              }}
            >
              {serviceId === "office-cleaning"
                ? "Почему выбирают нас:"
                : "Почему выбирают нашу уборку:"}
            </h3>

            <ul style={{ listStyle: "none", padding: 0 }}>
              {service.advantages.map((advantage, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "15px",
                    paddingLeft: "25px",
                    position: "relative",
                    fontSize: "15px",
                    lineHeight: "1.5",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      color: "#10b981",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </span>
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.additionalOptions && (
          <div
            style={{
              marginTop: "50px",
              padding: "30px",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "600",
                marginBottom: "20px",
                color: "#1a1a1a",
              }}
            >
              {service.additionalOptions.title}
            </h3>

            <ul style={{ listStyle: "none", padding: 0 }}>
              {service.additionalOptions.items.map((option, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "12px",
                    paddingLeft: "25px",
                    position: "relative",
                    fontSize: "15px",
                    lineHeight: "1.5",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      color: "#10b981",
                      fontWeight: "bold",
                    }}
                  >
                    •
                  </span>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Финальное примечание */}
        {service.finalNote && (
          <div
            style={{
              marginTop: "30px",
              padding: "25px",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              fontStyle: "italic",
              borderLeft: "4px solid #10b981",
            }}
          >
            {service.finalNote}
          </div>
        )}

        {/* Ссылка на портфолио */}
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            padding: "20px",
          }}
        >
          <Link
            to="/#portfolio"
            style={{
              color: "#10b981",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Посмотреть фото наших работ →
          </Link>
        </div>

        {/* Призыв к действию */}
        <div
          style={{
            marginTop: "30px",
            padding: "40px",
            backgroundColor: "#f2fdf4ff",
            color: "white",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "15px",
            }}
          >
            Готовы к идеальной чистоте?
          </h3>
          <p
            style={{
              marginBottom: "25px",
              fontSize: "16px",
              color: "black",
              opacity: "0.9",
            }}
          >
            {serviceId === "additional-services"
              ? "Рассчитайте точную стоимость и задайте вопрос нашим специалистам"
              : "Закажите уборку прямо сейчас и получите бесплатную консультацию"}
          </p>
          <Link
            to="/#calculator"
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "12px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            {serviceId === "additional-services"
              ? "Рассчитать стоимость"
              : "Заказать расчет"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
