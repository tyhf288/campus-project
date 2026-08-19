--
-- PostgreSQL database dump
--

\restrict qQCg2fsmquwXjMZeZdf6TtKJKKjba8P8aVQDdU8CIDq0EGMq5zKc8jSUa2EkZIU

-- Dumped from database version 15.18 (Debian 15.18-1.pgdg13+1)
-- Dumped by pg_dump version 15.18 (Debian 15.18-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: goodsManage; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "goodsManage";


ALTER SCHEMA "goodsManage" OWNER TO postgres;

--
-- Name: userManagement; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "userManagement";


ALTER SCHEMA "userManagement" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: category; Type: TABLE; Schema: goodsManage; Owner: postgres
--

CREATE TABLE "goodsManage".category (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    sort integer NOT NULL,
    enable boolean NOT NULL,
    create_at timestamp with time zone NOT NULL,
    update_at timestamp with time zone
);


ALTER TABLE "goodsManage".category OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: goodsManage; Owner: postgres
--

CREATE SEQUENCE "goodsManage".category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "goodsManage".category_id_seq OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: goodsManage; Owner: postgres
--

ALTER SEQUENCE "goodsManage".category_id_seq OWNED BY "goodsManage".category.id;


--
-- Name: collect; Type: TABLE; Schema: goodsManage; Owner: postgres
--

CREATE TABLE "goodsManage".collect (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    goods_id bigint NOT NULL,
    create_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE "goodsManage".collect OWNER TO postgres;

--
-- Name: collect_id_seq; Type: SEQUENCE; Schema: goodsManage; Owner: postgres
--

CREATE SEQUENCE "goodsManage".collect_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "goodsManage".collect_id_seq OWNER TO postgres;

--
-- Name: collect_id_seq; Type: SEQUENCE OWNED BY; Schema: goodsManage; Owner: postgres
--

ALTER SEQUENCE "goodsManage".collect_id_seq OWNED BY "goodsManage".collect.id;


--
-- Name: good; Type: TABLE; Schema: goodsManage; Owner: postgres
--

CREATE TABLE "goodsManage".good (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    is_anonymous boolean DEFAULT false NOT NULL,
    category_id bigint NOT NULL,
    title character varying(128) NOT NULL,
    "desc" text NOT NULL,
    price numeric(10,2) NOT NULL,
    quality text NOT NULL,
    place character varying(128),
    status text DEFAULT 'pending'::text,
    reject_reason character varying(256),
    view_count integer DEFAULT 0,
    collect_count integer DEFAULT 0,
    message_count integer DEFAULT 0,
    is_top boolean DEFAULT false,
    create_at timestamp with time zone DEFAULT now(),
    update_at timestamp with time zone,
    CONSTRAINT good_quality_check CHECK ((quality = ANY (ARRAY['new'::text, 'anew'::text, 'normal'::text, 'slight_used'::text, 'old'::text]))),
    CONSTRAINT good_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'reserved'::text, 'sold'::text, 'offline'::text])))
);


ALTER TABLE "goodsManage".good OWNER TO postgres;

--
-- Name: good_id_seq; Type: SEQUENCE; Schema: goodsManage; Owner: postgres
--

CREATE SEQUENCE "goodsManage".good_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "goodsManage".good_id_seq OWNER TO postgres;

--
-- Name: good_id_seq; Type: SEQUENCE OWNED BY; Schema: goodsManage; Owner: postgres
--

ALTER SEQUENCE "goodsManage".good_id_seq OWNED BY "goodsManage".good.id;


--
-- Name: image; Type: TABLE; Schema: goodsManage; Owner: postgres
--

CREATE TABLE "goodsManage".image (
    id integer NOT NULL,
    goods_id bigint NOT NULL,
    image_url character varying(512),
    is_main boolean DEFAULT false,
    create_at timestamp with time zone DEFAULT now()
);


ALTER TABLE "goodsManage".image OWNER TO postgres;

--
-- Name: image_id_seq; Type: SEQUENCE; Schema: goodsManage; Owner: postgres
--

CREATE SEQUENCE "goodsManage".image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "goodsManage".image_id_seq OWNER TO postgres;

--
-- Name: image_id_seq; Type: SEQUENCE OWNED BY; Schema: goodsManage; Owner: postgres
--

ALTER SEQUENCE "goodsManage".image_id_seq OWNED BY "goodsManage".image.id;


--
-- Name: message; Type: TABLE; Schema: goodsManage; Owner: postgres
--

CREATE TABLE "goodsManage".message (
    id integer NOT NULL,
    goods_id bigint NOT NULL,
    user_id bigint NOT NULL,
    parent_id bigint,
    content text NOT NULL,
    create_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE "goodsManage".message OWNER TO postgres;

--
-- Name: message_id_seq; Type: SEQUENCE; Schema: goodsManage; Owner: postgres
--

CREATE SEQUENCE "goodsManage".message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "goodsManage".message_id_seq OWNER TO postgres;

--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: goodsManage; Owner: postgres
--

ALTER SEQUENCE "goodsManage".message_id_seq OWNED BY "goodsManage".message.id;


--
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255),
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mikro_orm_migrations OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mikro_orm_migrations_id_seq OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- Name: blacklist; Type: TABLE; Schema: userManagement; Owner: postgres
--

CREATE TABLE "userManagement".blacklist (
    id integer NOT NULL,
    user_id integer NOT NULL,
    reason character varying(500) NOT NULL,
    operator_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    unbanned_at timestamp with time zone,
    unbanned_by_id integer,
    unbanned_date timestamp with time zone,
    unbanned_reason character varying(500)
);


ALTER TABLE "userManagement".blacklist OWNER TO postgres;

--
-- Name: blacklist_id_seq; Type: SEQUENCE; Schema: userManagement; Owner: postgres
--

CREATE SEQUENCE "userManagement".blacklist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "userManagement".blacklist_id_seq OWNER TO postgres;

--
-- Name: blacklist_id_seq; Type: SEQUENCE OWNED BY; Schema: userManagement; Owner: postgres
--

ALTER SEQUENCE "userManagement".blacklist_id_seq OWNED BY "userManagement".blacklist.id;


--
-- Name: user; Type: TABLE; Schema: userManagement; Owner: postgres
--

CREATE TABLE "userManagement"."user" (
    id integer NOT NULL,
    login_key character varying(255) NOT NULL,
    password character varying(255),
    nickname character varying(255) NOT NULL,
    avatar character varying(255),
    email character varying(255),
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    role text DEFAULT 'STUDENT'::text NOT NULL,
    terminal text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    openid character varying(255),
    CONSTRAINT user_role_check CHECK ((role = ANY (ARRAY['ADMIN'::text, 'AUDITOR'::text, 'STUDENT'::text]))),
    CONSTRAINT user_status_check CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'DISABLED'::text]))),
    CONSTRAINT user_terminal_check CHECK ((terminal = ANY (ARRAY['PC_ADMIN'::text, 'MINI_PROGRAM'::text])))
);


ALTER TABLE "userManagement"."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: userManagement; Owner: postgres
--

CREATE SEQUENCE "userManagement".user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "userManagement".user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: userManagement; Owner: postgres
--

ALTER SEQUENCE "userManagement".user_id_seq OWNED BY "userManagement"."user".id;


--
-- Name: category id; Type: DEFAULT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".category ALTER COLUMN id SET DEFAULT nextval('"goodsManage".category_id_seq'::regclass);


--
-- Name: collect id; Type: DEFAULT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".collect ALTER COLUMN id SET DEFAULT nextval('"goodsManage".collect_id_seq'::regclass);


--
-- Name: good id; Type: DEFAULT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".good ALTER COLUMN id SET DEFAULT nextval('"goodsManage".good_id_seq'::regclass);


--
-- Name: image id; Type: DEFAULT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".image ALTER COLUMN id SET DEFAULT nextval('"goodsManage".image_id_seq'::regclass);


--
-- Name: message id; Type: DEFAULT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".message ALTER COLUMN id SET DEFAULT nextval('"goodsManage".message_id_seq'::regclass);


--
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- Name: blacklist id; Type: DEFAULT; Schema: userManagement; Owner: postgres
--

ALTER TABLE ONLY "userManagement".blacklist ALTER COLUMN id SET DEFAULT nextval('"userManagement".blacklist_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: userManagement; Owner: postgres
--

ALTER TABLE ONLY "userManagement"."user" ALTER COLUMN id SET DEFAULT nextval('"userManagement".user_id_seq'::regclass);


--
-- Data for Name: category; Type: TABLE DATA; Schema: goodsManage; Owner: postgres
--

COPY "goodsManage".category (id, name, sort, enable, create_at, update_at) FROM stdin;
1	教材	1	t	2026-08-06 22:18:36+00	\N
2	电子产品	1	t	2026-08-10 13:11:58.14+00	\N
\.


--
-- Data for Name: collect; Type: TABLE DATA; Schema: goodsManage; Owner: postgres
--

COPY "goodsManage".collect (id, user_id, goods_id, create_at) FROM stdin;
\.


--
-- Data for Name: good; Type: TABLE DATA; Schema: goodsManage; Owner: postgres
--

COPY "goodsManage".good (id, user_id, is_anonymous, category_id, title, "desc", price, quality, place, status, reject_reason, view_count, collect_count, message_count, is_top, create_at, update_at) FROM stdin;
1	15	f	1	111	111	111.00	anew	111	approved	\N	0	0	0	f	2026-08-09 10:23:27.922+00	2026-08-09 10:23:27.922+00
2	15	f	1	222	222	222.00	normal	222	pending	\N	0	0	0	f	2026-08-13 09:44:37.585+00	2026-08-13 09:44:37.585+00
3	7	t	1	宿舍收纳箱大号	毕业出清，低价转让，附赠原装配件	3743.44	old	体育馆	pending	\N	151	75	17	f	2026-08-16 13:21:47.007+00	2026-08-16 13:21:47.007+00
4	10	f	1	斯伯丁篮球	闲置不用，便宜出，支持当面验货交易	4206.51	slight_used	图书馆门口	pending	\N	23	90	32	t	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
5	8	t	1	考研英语词汇书	闲置不用，便宜出，诚心出，接受议价	2334.68	slight_used	食堂门口	approved	\N	333	24	22	t	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
6	1	t	2	二手自行车 26 寸	自用半年，保存良好，校内面交优先	4943.78	old	教学楼 A 栋	pending	\N	388	47	8	t	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
7	4	t	2	罗技 G304 无线鼠标	质量很好，急用钱出售，不包邮，自提优先	4294.40	slight_used	食堂门口	pending	\N	125	3	8	t	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
8	9	f	2	24 寸 2K 显示器	开学季闲置，成色新，有意者私聊看图	1681.88	old	食堂门口	approved	\N	157	87	37	f	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
9	4	f	2	高等数学同济第七版	换新出旧，正常使用痕迹，诚心出，接受议价	1080.09	old	教学楼 A 栋	approved	\N	127	95	50	f	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
10	10	f	1	电热水壶 1.5L	毕业出清，低价转让，诚心出，接受议价	2716.86	new	食堂门口	approved	\N	250	8	29	t	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
11	8	t	2	ThinkPad 笔记本电脑	自用半年，保存良好，校内面交优先	4271.85	slight_used	图书馆门口	pending	\N	475	33	42	f	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
12	3	t	2	加厚瑜伽垫	毕业出清，低价转让，不包邮，自提优先	3777.22	normal	操场南门	approved	\N	481	59	10	t	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
13	8	f	2	斯伯丁篮球	闲置不用，便宜出，附赠原装配件	854.18	normal	教学楼 A 栋	approved	\N	68	25	9	t	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
14	9	f	1	小米 20000mAh 充电宝	几乎全新，仅用过几次，校内面交优先	1021.79	anew	一号宿舍楼下	approved	\N	69	11	50	t	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
15	6	f	2	iPhone 13 128G 国行	闲置不用，便宜出，不包邮，自提优先	1671.46	slight_used	图书馆门口	pending	\N	231	93	42	f	2026-08-16 13:21:47.009+00	2026-08-16 13:21:47.009+00
16	5	f	2	LED 护眼台灯	开学季闲置，成色新，诚心出，接受议价	4283.02	old	体育馆	approved	\N	199	41	12	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
17	4	f	2	宿舍收纳箱大号	功能完好，外观无损，不包邮，自提优先	4908.19	new	食堂门口	approved	\N	459	44	27	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
18	1	f	1	罗技 G304 无线鼠标	闲置不用，便宜出，校内面交优先	3669.93	anew	东门	pending	\N	389	21	35	f	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
19	3	f	1	小米 20000mAh 充电宝	几乎全新，仅用过几次，附赠原装配件	2519.16	slight_used	操场南门	approved	\N	268	43	30	f	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
20	7	t	1	相机三脚架	自用半年，保存良好，不包邮，自提优先	2908.63	normal	体育馆	approved	\N	199	81	5	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
21	4	f	2	宿舍收纳箱大号	闲置不用，便宜出，支持当面验货交易	4743.76	old	食堂门口	pending	\N	110	4	15	f	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
22	8	t	2	ThinkPad 笔记本电脑	闲置不用，便宜出，附赠原装配件	4484.74	old	东门	approved	\N	314	97	39	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
23	6	t	1	二手自行车 26 寸	毕业出清，低价转让，不包邮，自提优先	555.56	slight_used	操场南门	pending	\N	201	91	34	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
24	1	t	1	蓝牙耳机 AirPods	开学季闲置，成色新，有意者私聊看图	2884.99	anew	操场南门	approved	\N	400	100	14	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
25	4	f	1	iPad 平板电脑	闲置不用，便宜出，诚心出，接受议价	3345.57	old	图书馆门口	approved	\N	391	62	30	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
26	3	t	1	大学英语四级真题集	功能完好，外观无损，附赠原装配件	1966.62	new	体育馆	approved	\N	495	83	17	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
27	8	t	2	罗技 G304 无线鼠标	自用半年，保存良好，可小刀，非诚勿扰	1919.29	old	操场南门	approved	\N	24	51	1	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
28	8	t	2	高等数学同济第七版	开学季闲置，成色新，附赠原装配件	714.07	anew	教学楼 A 栋	pending	\N	45	48	24	f	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
29	7	t	2	小米 20000mAh 充电宝	自用半年，保存良好，不包邮，自提优先	1195.05	slight_used	东门	approved	\N	315	50	8	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
30	5	t	1	iPad 平板电脑	功能完好，外观无损，有意者私聊看图	3297.64	normal	一号宿舍楼下	approved	\N	355	13	5	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
31	8	t	1	宿舍收纳箱大号	闲置不用，便宜出，有意者私聊看图	4516.93	old	一号宿舍楼下	pending	\N	158	55	31	t	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
32	6	f	2	罗技 G304 无线鼠标	质量很好，急用钱出售，可小刀，非诚勿扰	1079.98	normal	图书馆门口	pending	\N	150	67	33	f	2026-08-16 13:21:47.01+00	2026-08-16 13:21:47.01+00
33	3	f	2	小米 20000mAh 充电宝	质量很好，急用钱出售，支持当面验货交易	4585.99	old	体育馆	approved	\N	429	11	33	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
34	10	f	1	ThinkPad 笔记本电脑	毕业出清，低价转让，支持当面验货交易	826.12	normal	体育馆	approved	\N	271	82	26	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
35	4	t	1	二手自行车 26 寸	闲置不用，便宜出，不包邮，自提优先	3165.59	anew	教学楼 A 栋	pending	\N	212	90	49	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
36	1	t	2	iPhone 13 128G 国行	质量很好，急用钱出售，支持当面验货交易	890.57	old	食堂门口	approved	\N	311	35	5	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
151	2	f	1	WiFi 6 路由器	毕业出清，低价转让，校内面交优先	3866.45	normal	东门	approved	\N	203	90	50	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
37	9	f	1	相机三脚架	功能完好，外观无损，支持当面验货交易	3160.51	slight_used	操场南门	approved	\N	329	41	4	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
38	4	f	2	木吉他 41 寸	功能完好，外观无损，诚心出，接受议价	1785.36	new	体育馆	approved	\N	403	31	4	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
39	1	t	1	斯伯丁篮球	功能完好，外观无损，支持当面验货交易	2286.58	anew	操场南门	approved	\N	479	52	35	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
40	4	f	2	相机三脚架	闲置不用，便宜出，诚心出，接受议价	3977.71	normal	东门	approved	\N	232	54	20	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
41	2	t	2	小米 20000mAh 充电宝	几乎全新，仅用过几次，校内面交优先	3004.93	new	东门	approved	\N	27	66	43	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
42	9	t	2	高等数学同济第七版	几乎全新，仅用过几次，校内面交优先	103.31	old	图书馆门口	approved	\N	294	33	9	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
43	6	f	1	iPhone 13 128G 国行	开学季闲置，成色新，诚心出，接受议价	2691.18	normal	东门	approved	\N	10	72	33	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
44	5	f	1	24 寸 2K 显示器	闲置不用，便宜出，可小刀，非诚勿扰	1548.49	slight_used	一号宿舍楼下	approved	\N	482	37	35	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
45	9	f	2	加厚瑜伽垫	功能完好，外观无损，校内面交优先	4433.72	new	东门	approved	\N	408	29	17	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
46	6	f	2	宿舍收纳箱大号	毕业出清，低价转让，可小刀，非诚勿扰	2637.48	anew	操场南门	approved	\N	377	20	19	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
47	2	t	2	LED 护眼台灯	开学季闲置，成色新，支持当面验货交易	4047.04	old	东门	pending	\N	379	32	49	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
48	8	t	2	iPad 平板电脑	开学季闲置，成色新，有意者私聊看图	2080.54	slight_used	食堂门口	approved	\N	395	25	37	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
49	7	t	2	加厚瑜伽垫	功能完好，外观无损，校内面交优先	2594.89	normal	一号宿舍楼下	approved	\N	355	84	18	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
50	7	f	2	蓝牙耳机 AirPods	闲置不用，便宜出，附赠原装配件	1591.81	anew	食堂门口	approved	\N	212	92	14	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
51	6	f	1	斯伯丁篮球	功能完好，外观无损，不包邮，自提优先	4255.07	normal	操场南门	approved	\N	46	73	16	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
52	5	t	2	ThinkPad 笔记本电脑	自用半年，保存良好，有意者私聊看图	2165.02	normal	一号宿舍楼下	approved	\N	31	12	49	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
53	8	t	2	机械键盘 87 键	开学季闲置，成色新，不包邮，自提优先	2507.77	slight_used	教学楼 A 栋	approved	\N	190	100	46	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
54	8	t	1	考研英语词汇书	几乎全新，仅用过几次，可小刀，非诚勿扰	4129.25	old	体育馆	approved	\N	470	51	20	f	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
55	5	t	1	24 寸 2K 显示器	换新出旧，正常使用痕迹，附赠原装配件	3611.73	new	一号宿舍楼下	pending	\N	115	14	6	t	2026-08-16 13:21:47.011+00	2026-08-16 13:21:47.011+00
56	8	t	1	二手自行车 26 寸	毕业出清，低价转让，支持当面验货交易	4253.02	slight_used	东门	approved	\N	29	46	23	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
57	5	t	1	iPad 平板电脑	自用半年，保存良好，校内面交优先	3414.32	anew	一号宿舍楼下	approved	\N	70	32	37	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
58	5	t	2	相机三脚架	闲置不用，便宜出，不包邮，自提优先	3316.52	normal	食堂门口	approved	\N	108	89	50	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
59	4	f	1	WiFi 6 路由器	开学季闲置，成色新，不包邮，自提优先	591.56	normal	一号宿舍楼下	approved	\N	299	30	28	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
60	1	f	2	相机三脚架	闲置不用，便宜出，可小刀，非诚勿扰	512.24	new	体育馆	approved	\N	5	54	42	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
61	4	t	2	ThinkPad 笔记本电脑	自用半年，保存良好，不包邮，自提优先	1514.58	anew	一号宿舍楼下	approved	\N	125	70	19	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
62	1	t	2	WiFi 6 路由器	开学季闲置，成色新，支持当面验货交易	1107.22	anew	食堂门口	approved	\N	446	28	20	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
63	9	t	2	机械键盘 87 键	自用半年，保存良好，校内面交优先	1040.26	slight_used	教学楼 A 栋	pending	\N	91	11	11	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
64	4	t	2	WiFi 6 路由器	几乎全新，仅用过几次，有意者私聊看图	4230.80	anew	教学楼 A 栋	approved	\N	17	34	12	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
65	5	t	2	斯伯丁篮球	毕业出清，低价转让，可小刀，非诚勿扰	3980.14	anew	东门	approved	\N	332	35	44	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
66	9	t	1	蓝牙耳机 AirPods	功能完好，外观无损，有意者私聊看图	3384.25	normal	操场南门	pending	\N	16	28	32	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
67	4	t	2	WiFi 6 路由器	闲置不用，便宜出，诚心出，接受议价	1310.63	slight_used	食堂门口	approved	\N	29	95	44	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
68	6	t	2	相机三脚架	质量很好，急用钱出售，可小刀，非诚勿扰	4705.05	anew	东门	approved	\N	482	31	19	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
69	1	f	1	斯伯丁篮球	换新出旧，正常使用痕迹，诚心出，接受议价	1461.48	anew	一号宿舍楼下	approved	\N	34	29	31	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
70	10	f	1	小米 20000mAh 充电宝	闲置不用，便宜出，校内面交优先	2865.25	old	图书馆门口	approved	\N	26	18	0	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
71	1	t	1	高等数学同济第七版	毕业出清，低价转让，附赠原装配件	3305.46	old	东门	approved	\N	65	9	15	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
72	9	f	1	二手自行车 26 寸	闲置不用，便宜出，校内面交优先	650.45	slight_used	东门	approved	\N	350	87	2	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
73	5	f	2	斯伯丁篮球	毕业出清，低价转让，附赠原装配件	951.11	anew	图书馆门口	approved	\N	0	80	1	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
74	2	f	1	WiFi 6 路由器	换新出旧，正常使用痕迹，有意者私聊看图	491.55	old	操场南门	approved	\N	456	28	45	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
75	5	f	1	加厚瑜伽垫	毕业出清，低价转让，校内面交优先	3579.03	slight_used	东门	approved	\N	257	65	43	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
76	2	f	1	大学英语四级真题集	质量很好，急用钱出售，有意者私聊看图	1856.54	normal	教学楼 A 栋	approved	\N	448	84	48	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
77	4	t	2	WiFi 6 路由器	毕业出清，低价转让，有意者私聊看图	4585.08	normal	操场南门	approved	\N	475	42	19	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
78	6	t	2	宿舍收纳箱大号	质量很好，急用钱出售，支持当面验货交易	2735.76	slight_used	食堂门口	approved	\N	311	28	45	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
79	2	t	1	宿舍收纳箱大号	开学季闲置，成色新，有意者私聊看图	1654.23	slight_used	图书馆门口	approved	\N	304	17	2	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
80	2	t	2	蓝牙耳机 AirPods	自用半年，保存良好，不包邮，自提优先	4086.80	normal	图书馆门口	pending	\N	162	47	42	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
81	2	f	1	考研英语词汇书	闲置不用，便宜出，可小刀，非诚勿扰	3518.92	anew	体育馆	approved	\N	327	26	13	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
82	7	f	2	二手自行车 26 寸	开学季闲置，成色新，有意者私聊看图	265.09	normal	操场南门	approved	\N	397	56	36	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
83	5	t	1	相机三脚架	毕业出清，低价转让，支持当面验货交易	4933.72	anew	图书馆门口	approved	\N	130	41	27	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
84	3	t	1	LED 护眼台灯	毕业出清，低价转让，诚心出，接受议价	3352.30	new	东门	pending	\N	381	74	48	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
85	9	f	2	24 寸 2K 显示器	开学季闲置，成色新，支持当面验货交易	2669.12	old	食堂门口	approved	\N	375	82	33	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
86	9	f	2	24 寸 2K 显示器	闲置不用，便宜出，可小刀，非诚勿扰	4402.59	normal	教学楼 A 栋	approved	\N	149	16	25	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
87	4	t	2	电热水壶 1.5L	换新出旧，正常使用痕迹，诚心出，接受议价	283.25	old	食堂门口	pending	\N	168	73	12	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
88	4	t	1	iPad 平板电脑	功能完好，外观无损，有意者私聊看图	102.29	slight_used	教学楼 A 栋	approved	\N	246	23	37	t	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
89	10	t	1	加厚瑜伽垫	自用半年，保存良好，支持当面验货交易	4557.68	anew	一号宿舍楼下	approved	\N	269	22	37	f	2026-08-16 13:21:47.012+00	2026-08-16 13:21:47.012+00
90	2	f	1	蓝牙耳机 AirPods	换新出旧，正常使用痕迹，诚心出，接受议价	743.05	new	图书馆门口	approved	\N	292	90	13	f	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
91	8	f	2	宿舍收纳箱大号	毕业出清，低价转让，有意者私聊看图	2283.78	old	操场南门	approved	\N	184	35	6	f	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
92	2	t	2	宿舍收纳箱大号	开学季闲置，成色新，可小刀，非诚勿扰	16.76	old	一号宿舍楼下	pending	\N	202	6	20	f	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
93	1	f	2	WiFi 6 路由器	换新出旧，正常使用痕迹，附赠原装配件	2199.16	new	体育馆	approved	\N	216	85	30	f	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
94	7	f	2	罗技 G304 无线鼠标	闲置不用，便宜出，不包邮，自提优先	947.82	new	图书馆门口	approved	\N	415	4	36	f	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
95	2	t	1	WiFi 6 路由器	自用半年，保存良好，附赠原装配件	1559.60	old	东门	approved	\N	45	63	25	t	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
96	9	f	2	二手自行车 26 寸	功能完好，外观无损，附赠原装配件	3221.13	slight_used	东门	pending	\N	331	49	34	t	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
97	3	t	1	木吉他 41 寸	开学季闲置，成色新，诚心出，接受议价	4814.83	slight_used	教学楼 A 栋	approved	\N	57	98	35	f	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
98	2	t	1	iPad 平板电脑	开学季闲置，成色新，可小刀，非诚勿扰	4875.69	anew	教学楼 A 栋	approved	\N	354	11	28	t	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
99	5	t	2	罗技 G304 无线鼠标	闲置不用，便宜出，附赠原装配件	4716.18	normal	一号宿舍楼下	approved	\N	311	15	18	t	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
100	7	f	2	考研英语词汇书	功能完好，外观无损，校内面交优先	4504.23	anew	体育馆	pending	\N	239	42	41	f	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
101	5	t	1	机械键盘 87 键	开学季闲置，成色新，附赠原装配件	2240.68	anew	体育馆	approved	\N	491	14	31	t	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
102	3	t	2	iPhone 13 128G 国行	功能完好，外观无损，不包邮，自提优先	2468.66	normal	一号宿舍楼下	approved	\N	454	99	13	t	2026-08-16 13:21:47.013+00	2026-08-16 13:21:47.013+00
103	5	t	1	iPad 平板电脑	毕业出清，低价转让，诚心出，接受议价	3441.83	slight_used	体育馆	approved	\N	362	49	39	f	2026-08-16 13:29:05.112+00	2026-08-16 13:29:05.112+00
104	4	f	1	高等数学同济第七版	换新出旧，正常使用痕迹，可小刀，非诚勿扰	2339.84	new	操场南门	approved	\N	498	70	45	f	2026-08-16 13:29:05.114+00	2026-08-16 13:29:05.114+00
105	6	t	1	iPhone 13 128G 国行	功能完好，外观无损，支持当面验货交易	1761.35	normal	操场南门	pending	\N	173	65	10	t	2026-08-16 13:29:05.114+00	2026-08-16 13:29:05.114+00
106	3	t	1	高等数学同济第七版	自用半年，保存良好，诚心出，接受议价	2569.95	new	食堂门口	approved	\N	372	3	27	t	2026-08-16 13:29:05.114+00	2026-08-16 13:29:05.114+00
107	10	t	1	宿舍收纳箱大号	换新出旧，正常使用痕迹，可小刀，非诚勿扰	569.36	slight_used	操场南门	approved	\N	126	70	2	t	2026-08-16 13:29:05.114+00	2026-08-16 13:29:05.114+00
108	4	t	2	木吉他 41 寸	开学季闲置，成色新，诚心出，接受议价	4475.99	old	一号宿舍楼下	approved	\N	268	43	15	f	2026-08-16 13:29:05.114+00	2026-08-16 13:29:05.114+00
109	2	f	2	电热水壶 1.5L	闲置不用，便宜出，诚心出，接受议价	594.59	slight_used	教学楼 A 栋	approved	\N	498	46	30	t	2026-08-16 13:29:05.114+00	2026-08-16 13:29:05.114+00
110	5	f	1	电热水壶 1.5L	闲置不用，便宜出，可小刀，非诚勿扰	1167.96	anew	东门	approved	\N	20	86	24	t	2026-08-16 13:29:05.114+00	2026-08-16 13:29:05.114+00
111	8	t	1	大学英语四级真题集	质量很好，急用钱出售，附赠原装配件	1171.78	slight_used	东门	approved	\N	72	13	0	t	2026-08-16 13:29:05.114+00	2026-08-16 13:29:05.114+00
112	8	f	2	LED 护眼台灯	换新出旧，正常使用痕迹，诚心出，接受议价	1965.00	old	食堂门口	approved	\N	154	91	15	f	2026-08-16 13:29:05.114+00	2026-08-16 13:29:05.114+00
113	6	t	1	机械键盘 87 键	几乎全新，仅用过几次，附赠原装配件	3880.03	new	一号宿舍楼下	approved	\N	150	64	3	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
114	1	t	1	蓝牙耳机 AirPods	闲置不用，便宜出，不包邮，自提优先	3903.91	normal	食堂门口	approved	\N	327	69	11	f	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
115	10	t	2	小米 20000mAh 充电宝	自用半年，保存良好，诚心出，接受议价	1021.29	new	东门	approved	\N	489	62	22	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
116	7	t	1	蓝牙耳机 AirPods	质量很好，急用钱出售，支持当面验货交易	4228.33	anew	体育馆	approved	\N	191	7	33	f	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
117	8	f	2	加厚瑜伽垫	毕业出清，低价转让，诚心出，接受议价	991.16	anew	食堂门口	approved	\N	104	43	37	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
118	3	f	1	蓝牙耳机 AirPods	毕业出清，低价转让，诚心出，接受议价	1830.17	normal	操场南门	approved	\N	219	65	27	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
119	3	f	1	加厚瑜伽垫	自用半年，保存良好，有意者私聊看图	2975.46	normal	操场南门	pending	\N	121	100	33	f	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
120	7	f	2	iPhone 13 128G 国行	闲置不用，便宜出，附赠原装配件	4752.47	old	图书馆门口	approved	\N	373	63	2	f	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
121	5	t	1	WiFi 6 路由器	几乎全新，仅用过几次，支持当面验货交易	1278.93	slight_used	操场南门	approved	\N	184	63	38	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
122	3	t	2	加厚瑜伽垫	质量很好，急用钱出售，校内面交优先	2514.72	old	操场南门	approved	\N	56	84	11	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
123	10	t	1	小米 20000mAh 充电宝	开学季闲置，成色新，附赠原装配件	2024.61	old	食堂门口	pending	\N	275	68	9	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
124	4	f	2	WiFi 6 路由器	功能完好，外观无损，附赠原装配件	1547.82	normal	食堂门口	approved	\N	495	31	14	f	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
125	3	f	2	相机三脚架	换新出旧，正常使用痕迹，校内面交优先	196.08	old	教学楼 A 栋	approved	\N	168	22	11	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
126	8	t	2	iPhone 13 128G 国行	几乎全新，仅用过几次，校内面交优先	4599.67	slight_used	教学楼 A 栋	approved	\N	356	26	13	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
127	2	t	1	加厚瑜伽垫	质量很好，急用钱出售，校内面交优先	109.86	new	教学楼 A 栋	approved	\N	174	2	12	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
128	6	t	2	高等数学同济第七版	开学季闲置，成色新，可小刀，非诚勿扰	4070.63	anew	食堂门口	approved	\N	405	15	32	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
129	7	f	1	电热水壶 1.5L	自用半年，保存良好，支持当面验货交易	2843.30	old	图书馆门口	approved	\N	182	63	17	t	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
130	10	t	1	考研英语词汇书	几乎全新，仅用过几次，支持当面验货交易	504.62	slight_used	食堂门口	approved	\N	343	60	35	f	2026-08-16 13:29:05.115+00	2026-08-16 13:29:05.115+00
131	6	f	1	WiFi 6 路由器	自用半年，保存良好，支持当面验货交易	3188.24	slight_used	操场南门	approved	\N	277	71	40	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
132	10	t	2	高等数学同济第七版	功能完好，外观无损，有意者私聊看图	2166.02	slight_used	体育馆	approved	\N	348	35	48	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
133	7	f	2	罗技 G304 无线鼠标	自用半年，保存良好，不包邮，自提优先	4774.92	new	图书馆门口	approved	\N	353	56	41	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
134	7	f	2	木吉他 41 寸	换新出旧，正常使用痕迹，可小刀，非诚勿扰	1399.58	normal	食堂门口	approved	\N	434	96	39	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
135	8	t	1	小米 20000mAh 充电宝	闲置不用，便宜出，校内面交优先	3574.01	old	教学楼 A 栋	approved	\N	324	50	37	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
136	8	t	2	宿舍收纳箱大号	换新出旧，正常使用痕迹，不包邮，自提优先	3961.41	new	教学楼 A 栋	approved	\N	468	74	39	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
137	5	f	2	24 寸 2K 显示器	闲置不用，便宜出，不包邮，自提优先	1003.23	anew	食堂门口	approved	\N	451	22	30	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
138	8	t	2	iPad 平板电脑	换新出旧，正常使用痕迹，可小刀，非诚勿扰	466.26	slight_used	一号宿舍楼下	approved	\N	379	58	9	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
139	5	t	2	蓝牙耳机 AirPods	质量很好，急用钱出售，不包邮，自提优先	334.87	new	体育馆	approved	\N	419	85	22	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
140	10	f	2	ThinkPad 笔记本电脑	闲置不用，便宜出，诚心出，接受议价	4788.34	old	体育馆	pending	\N	217	73	33	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
141	5	t	2	加厚瑜伽垫	毕业出清，低价转让，不包邮，自提优先	4890.18	normal	图书馆门口	approved	\N	143	92	28	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
142	10	f	2	罗技 G304 无线鼠标	自用半年，保存良好，附赠原装配件	3145.16	anew	东门	approved	\N	231	56	24	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
143	5	f	1	斯伯丁篮球	毕业出清，低价转让，校内面交优先	952.68	normal	操场南门	pending	\N	279	68	44	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
144	10	t	1	相机三脚架	开学季闲置，成色新，附赠原装配件	1912.09	new	食堂门口	approved	\N	242	18	23	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
145	1	f	2	斯伯丁篮球	自用半年，保存良好，可小刀，非诚勿扰	1315.00	normal	食堂门口	pending	\N	463	46	9	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
146	1	t	2	机械键盘 87 键	自用半年，保存良好，附赠原装配件	3309.06	normal	操场南门	approved	\N	287	15	46	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
147	5	f	2	iPhone 13 128G 国行	开学季闲置，成色新，支持当面验货交易	4146.11	normal	教学楼 A 栋	approved	\N	41	54	44	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
148	8	f	2	iPad 平板电脑	闲置不用，便宜出，附赠原装配件	4498.04	anew	教学楼 A 栋	pending	\N	260	88	13	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
149	8	t	2	斯伯丁篮球	闲置不用，便宜出，附赠原装配件	1939.57	old	食堂门口	approved	\N	282	57	20	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
150	3	f	2	大学英语四级真题集	换新出旧，正常使用痕迹，诚心出，接受议价	1115.93	anew	教学楼 A 栋	pending	\N	238	39	46	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
152	9	t	1	二手自行车 26 寸	几乎全新，仅用过几次，附赠原装配件	1725.80	old	一号宿舍楼下	approved	\N	192	79	17	t	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
153	4	t	1	24 寸 2K 显示器	几乎全新，仅用过几次，不包邮，自提优先	2157.91	old	图书馆门口	approved	\N	444	100	19	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
154	9	t	2	电热水壶 1.5L	功能完好，外观无损，可小刀，非诚勿扰	3419.66	normal	东门	approved	\N	410	62	7	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
155	6	f	1	相机三脚架	毕业出清，低价转让，可小刀，非诚勿扰	2502.38	new	图书馆门口	approved	\N	158	72	13	f	2026-08-16 13:29:05.116+00	2026-08-16 13:29:05.116+00
156	10	t	2	ThinkPad 笔记本电脑	闲置不用，便宜出，支持当面验货交易	4747.32	new	教学楼 A 栋	approved	\N	179	70	42	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
157	1	t	2	考研英语词汇书	质量很好，急用钱出售，诚心出，接受议价	2931.32	new	操场南门	approved	\N	276	64	50	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
158	6	f	2	24 寸 2K 显示器	开学季闲置，成色新，附赠原装配件	3940.86	new	体育馆	approved	\N	183	77	42	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
159	1	t	1	24 寸 2K 显示器	自用半年，保存良好，不包邮，自提优先	3124.27	old	东门	approved	\N	259	11	6	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
160	4	t	2	iPad 平板电脑	毕业出清，低价转让，支持当面验货交易	911.18	new	一号宿舍楼下	pending	\N	456	78	1	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
161	9	t	1	二手自行车 26 寸	换新出旧，正常使用痕迹，诚心出，接受议价	2435.91	normal	操场南门	pending	\N	133	100	24	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
162	4	t	2	ThinkPad 笔记本电脑	自用半年，保存良好，校内面交优先	3920.09	slight_used	操场南门	approved	\N	408	96	8	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
163	10	f	2	罗技 G304 无线鼠标	开学季闲置，成色新，附赠原装配件	2314.89	old	食堂门口	approved	\N	140	21	23	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
164	7	t	2	高等数学同济第七版	开学季闲置，成色新，可小刀，非诚勿扰	596.87	normal	食堂门口	approved	\N	28	61	22	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
165	4	f	2	iPad 平板电脑	换新出旧，正常使用痕迹，可小刀，非诚勿扰	3662.55	old	一号宿舍楼下	approved	\N	374	65	7	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
166	3	t	2	LED 护眼台灯	闲置不用，便宜出，不包邮，自提优先	1970.61	anew	体育馆	approved	\N	406	94	46	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
167	7	t	1	LED 护眼台灯	闲置不用，便宜出，有意者私聊看图	4365.62	anew	东门	approved	\N	44	59	25	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
168	10	t	2	宿舍收纳箱大号	换新出旧，正常使用痕迹，附赠原装配件	109.51	new	体育馆	approved	\N	174	81	36	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
169	3	t	1	LED 护眼台灯	质量很好，急用钱出售，有意者私聊看图	4144.99	anew	教学楼 A 栋	approved	\N	471	8	10	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
170	4	f	1	高等数学同济第七版	毕业出清，低价转让，有意者私聊看图	3607.79	slight_used	一号宿舍楼下	approved	\N	445	89	43	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
171	8	t	2	蓝牙耳机 AirPods	质量很好，急用钱出售，附赠原装配件	1167.50	anew	东门	approved	\N	52	64	40	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
172	3	f	1	木吉他 41 寸	换新出旧，正常使用痕迹，诚心出，接受议价	2899.52	normal	图书馆门口	approved	\N	358	29	37	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
173	6	f	1	高等数学同济第七版	质量很好，急用钱出售，可小刀，非诚勿扰	2342.23	new	一号宿舍楼下	approved	\N	424	9	39	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
174	9	f	2	高等数学同济第七版	质量很好，急用钱出售，支持当面验货交易	4175.53	old	操场南门	pending	\N	316	10	19	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
175	1	t	2	斯伯丁篮球	闲置不用，便宜出，校内面交优先	4162.29	new	东门	approved	\N	414	66	36	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
176	7	t	2	考研英语词汇书	功能完好，外观无损，附赠原装配件	1122.46	new	教学楼 A 栋	approved	\N	184	41	19	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
177	6	t	2	宿舍收纳箱大号	自用半年，保存良好，不包邮，自提优先	1234.35	slight_used	体育馆	approved	\N	463	34	38	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
178	1	f	1	相机三脚架	质量很好，急用钱出售，校内面交优先	3257.68	anew	食堂门口	approved	\N	274	50	44	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
179	2	t	1	LED 护眼台灯	闲置不用，便宜出，附赠原装配件	131.85	anew	图书馆门口	pending	\N	321	65	29	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
180	4	t	2	罗技 G304 无线鼠标	闲置不用，便宜出，支持当面验货交易	3322.55	slight_used	食堂门口	pending	\N	17	6	29	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
181	4	f	1	大学英语四级真题集	功能完好，外观无损，附赠原装配件	4002.32	old	图书馆门口	approved	\N	361	82	36	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
182	1	t	1	24 寸 2K 显示器	毕业出清，低价转让，附赠原装配件	2851.19	normal	体育馆	approved	\N	79	75	13	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
183	9	f	2	WiFi 6 路由器	开学季闲置，成色新，可小刀，非诚勿扰	518.64	anew	教学楼 A 栋	approved	\N	428	27	16	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
184	7	t	2	木吉他 41 寸	闲置不用，便宜出，支持当面验货交易	1785.56	slight_used	一号宿舍楼下	pending	\N	319	91	20	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
185	3	f	2	二手自行车 26 寸	功能完好，外观无损，附赠原装配件	1557.99	anew	图书馆门口	approved	\N	436	33	25	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
186	7	f	1	LED 护眼台灯	质量很好，急用钱出售，诚心出，接受议价	2379.65	slight_used	食堂门口	pending	\N	18	32	8	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
187	9	f	1	高等数学同济第七版	开学季闲置，成色新，可小刀，非诚勿扰	446.64	anew	东门	approved	\N	227	89	21	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
188	2	t	2	iPad 平板电脑	闲置不用，便宜出，支持当面验货交易	3017.64	old	食堂门口	approved	\N	443	35	18	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
189	5	f	1	高等数学同济第七版	几乎全新，仅用过几次，诚心出，接受议价	2794.07	slight_used	一号宿舍楼下	approved	\N	12	16	8	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
190	5	t	2	24 寸 2K 显示器	开学季闲置，成色新，可小刀，非诚勿扰	2552.14	new	一号宿舍楼下	approved	\N	350	67	11	t	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
191	4	f	1	机械键盘 87 键	换新出旧，正常使用痕迹，不包邮，自提优先	1950.35	anew	体育馆	pending	\N	303	46	23	f	2026-08-16 13:29:05.117+00	2026-08-16 13:29:05.117+00
192	8	f	1	ThinkPad 笔记本电脑	毕业出清，低价转让，校内面交优先	3217.91	anew	东门	pending	\N	282	83	10	f	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
193	9	t	1	考研英语词汇书	功能完好，外观无损，附赠原装配件	1197.09	anew	体育馆	pending	\N	402	49	3	f	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
194	4	f	1	WiFi 6 路由器	开学季闲置，成色新，诚心出，接受议价	3416.13	new	图书馆门口	approved	\N	274	100	16	f	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
195	2	f	1	大学英语四级真题集	开学季闲置，成色新，不包邮，自提优先	879.83	normal	操场南门	approved	\N	275	100	33	t	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
196	2	t	1	加厚瑜伽垫	闲置不用，便宜出，有意者私聊看图	4615.95	slight_used	食堂门口	approved	\N	299	70	29	t	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
197	4	t	1	木吉他 41 寸	开学季闲置，成色新，有意者私聊看图	2106.37	normal	教学楼 A 栋	approved	\N	401	55	50	f	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
198	8	t	2	斯伯丁篮球	开学季闲置，成色新，有意者私聊看图	2174.65	normal	体育馆	approved	\N	88	3	0	f	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
199	7	f	2	高等数学同济第七版	换新出旧，正常使用痕迹，附赠原装配件	4507.01	normal	体育馆	pending	\N	152	50	47	t	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
200	6	t	2	考研英语词汇书	换新出旧，正常使用痕迹，有意者私聊看图	2977.20	new	操场南门	pending	\N	6	54	21	f	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
201	5	t	1	考研英语词汇书	功能完好，外观无损，不包邮，自提优先	4089.53	new	食堂门口	approved	\N	65	91	27	t	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
202	4	t	1	蓝牙耳机 AirPods	换新出旧，正常使用痕迹，支持当面验货交易	2905.18	old	体育馆	approved	\N	441	48	36	f	2026-08-16 13:29:05.118+00	2026-08-16 13:29:05.118+00
\.


--
-- Data for Name: image; Type: TABLE DATA; Schema: goodsManage; Owner: postgres
--

COPY "goodsManage".image (id, goods_id, image_url, is_main, create_at) FROM stdin;
1	1	https://tyhf-campus-oss.oss-cn-beijing.aliyuncs.com/goods/1786271007100_dpgum3.png	f	2026-08-09 10:23:27.958+00
2	2	https://tyhf-campus-oss.oss-cn-beijing.aliyuncs.com/goods/1786614276342_r61faq.png	f	2026-08-13 09:44:37.606+00
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: goodsManage; Owner: postgres
--

COPY "goodsManage".message (id, goods_id, user_id, parent_id, content, create_at) FROM stdin;
\.


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260724085252	2026-07-24 08:54:37.226344+00
2	Migration20260724085405	2026-07-24 08:54:37.226344+00
3	Migration20260727035947	2026-07-27 04:00:02.260036+00
4	Migration20260806141417	2026-08-06 14:15:02.385816+00
5	Migration20260809041406	2026-08-09 04:15:17.874272+00
6	Migration20260809041511	2026-08-09 04:15:17.874272+00
7	Migration20260809042019	2026-08-09 04:20:24.003369+00
\.


--
-- Data for Name: blacklist; Type: TABLE DATA; Schema: userManagement; Owner: postgres
--

COPY "userManagement".blacklist (id, user_id, reason, operator_id, created_at, unbanned_at, unbanned_by_id, unbanned_date, unbanned_reason) FROM stdin;
1	3	测试1111	11	2026-07-26 04:31:08.134+00	\N	\N	\N	\N
2	4	2323	11	2026-07-26 04:35:10.353+00	\N	\N	\N	\N
41	7	测试7777	11	2026-07-27 09:36:49.808+00	2026-07-27 10:06:46.38+00	\N	2026-07-28 08:59:00.057+00	系统自动解封
42	10	测试自动解封	11	2026-07-27 09:55:07.032+00	2026-07-27 09:59:59.011+00	\N	2026-07-28 08:59:00.09+00	系统自动解封
43	7	测试2-111	11	2026-07-28 09:14:22.494+00	2026-07-28 09:19:16.552+00	\N	2026-07-28 09:20:00.039+00	系统自动解封
40	3	测试666	11	2026-07-27 09:32:14.356+00	\N	11	2026-07-28 12:12:44.369+00	测试111
39	9	测试2222	11	2026-07-27 09:17:45.319+00	\N	11	2026-07-28 12:14:20.414+00	测试33333
38	2	测试444	11	2026-07-27 09:11:33.111+00	\N	11	2026-07-28 12:20:58.157+00	测试33333
37	8	测试444	11	2026-07-27 09:03:15.124+00	\N	11	2026-07-29 13:55:10.501+00	111
36	6	测试3333	11	2026-07-27 08:59:21.906+00	\N	11	2026-07-29 13:55:22.198+00	111
35	5	测试222	11	2026-07-26 08:22:11.034+00	\N	11	2026-07-29 13:55:23.882+00	111
44	2	测试5332	11	2026-07-28 12:21:32.332+00	2026-07-28 12:26:26.758+00	\N	2026-07-30 03:40:00.056+00	系统自动解封
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: userManagement; Owner: postgres
--

COPY "userManagement"."user" (id, login_key, password, nickname, avatar, email, status, role, terminal, created_at, updated_at, openid) FROM stdin;
1	millet763	FwfwsZXupeGkglx	Jean48	\N	Nancy_Metz85@yahoo.com	ACTIVE	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.314+00	\N	\N
11	admin	$2b$10$/8F0CTHvWx1SOdCNPWaur.KLUGogvuHJXQ247oR.fH8NkOGn6uxd2	管理员	\N	\N	ACTIVE	ADMIN	PC_ADMIN	2026-07-24 09:26:09.11+00	\N	\N
4	defendant255	KuVKw4t4LLZcY8H	Priscilla_Cremin	\N	Jermaine.Keebler@yahoo.com	DISABLED	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.316+00	\N	\N
3	stock626	AxnQZdaZZmPs8bh	Willa51	\N	Mario.Yundt@gmail.com	DISABLED	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.316+00	2026-07-27 09:32:14.359+00	\N
7	density789	ByLcuejmjfeDrOl	Lindsey86	\N	Becky75@gmail.com	ACTIVE	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.316+00	2026-07-28 09:20:00.039+00	\N
9	cake603	40H0xRnrxVlWUNX	Priscilla66	\N	Freddie_Corwin1@gmail.com	ACTIVE	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.316+00	2026-07-28 12:14:20.418+00	\N
13	123123	$2b$10$3xTJyF4S4UM.rD7hD2ST7.Lz8QtIQ0Ur.eNJ6LNHEw24.10uVRE.K	123123	https://tyhf-campus-oss.oss-cn-beijing.aliyuncs.com/avatars/1785333201113_meheso.png	\N	ACTIVE	STUDENT	PC_ADMIN	2026-07-29 13:53:41.301+00	\N	\N
8	comparison757	ZX2RGtZqnS1IPKy	Audie.Hermiston35	\N	Martha16@yahoo.com	ACTIVE	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.316+00	2026-07-29 13:55:10.501+00	\N
5	tune-up756	FssQCDcZkrz_XbA	Donna0	\N	Bartholome.Grant88@gmail.com	ACTIVE	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.316+00	2026-07-29 13:55:23.883+00	\N
6	kettledrum179	Hz_hn8buKK6JfQq	Kayl2312	\N	Guy_Koepp@hotmail.com	ACTIVE	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.316+00	2026-07-29 15:32:06.44+00	\N
12	12312	$2b$10$ihW1qA4/60ta5NVHJW/9seLVtzvgvqqDHhnlw3RG6tfndeaQUVkau	123123	https://tyhf-campus-oss.oss-cn-beijing.aliyuncs.com/avatars/1785339178108_dg5b6d.png	\N	ACTIVE	AUDITOR	PC_ADMIN	2026-07-29 13:52:59.162+00	2026-07-29 15:33:01.173+00	\N
2	luck296	dsKzaeY1Qhqn9tC	Darrion_DAmore	\N	Jerel17@yahoo.com	ACTIVE	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.316+00	2026-07-30 03:40:00.058+00	\N
10	import496	TYHKE4nDMkyxXof	Shawna99	https://tyhf-campus-oss.oss-cn-beijing.aliyuncs.com/avatars/1785836789925_avn00h.webp	Raquel_Rutherford50@gmail.com	ACTIVE	STUDENT	MINI_PROGRAM	2026-07-24 08:57:49.316+00	2026-08-04 09:46:31.788+00	\N
15	U1000014	\N	あい	https://tyhf-campus-oss.oss-cn-beijing.aliyuncs.com/avatars/1785837658085_ccan02.jpeg	\N	ACTIVE	STUDENT	MINI_PROGRAM	2026-08-04 10:01:05.24+00	\N	opaw_14Yxt5XS0VsnnO5fg0REiMI
16	auditor1	$2b$10$upC3JXpDbk1EzkT0Fv6dmOAwBePwJL2b1E64DQdNFzuXzdPVgpELW	审核员1	\N	\N	ACTIVE	AUDITOR	PC_ADMIN	2026-08-13 09:47:01.43+00	\N	\N
\.


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: goodsManage; Owner: postgres
--

SELECT pg_catalog.setval('"goodsManage".category_id_seq', 2, true);


--
-- Name: collect_id_seq; Type: SEQUENCE SET; Schema: goodsManage; Owner: postgres
--

SELECT pg_catalog.setval('"goodsManage".collect_id_seq', 1, false);


--
-- Name: good_id_seq; Type: SEQUENCE SET; Schema: goodsManage; Owner: postgres
--

SELECT pg_catalog.setval('"goodsManage".good_id_seq', 202, true);


--
-- Name: image_id_seq; Type: SEQUENCE SET; Schema: goodsManage; Owner: postgres
--

SELECT pg_catalog.setval('"goodsManage".image_id_seq', 2, true);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: goodsManage; Owner: postgres
--

SELECT pg_catalog.setval('"goodsManage".message_id_seq', 1, false);


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 7, true);


--
-- Name: blacklist_id_seq; Type: SEQUENCE SET; Schema: userManagement; Owner: postgres
--

SELECT pg_catalog.setval('"userManagement".blacklist_id_seq', 44, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: userManagement; Owner: postgres
--

SELECT pg_catalog.setval('"userManagement".user_id_seq', 16, true);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: collect collect_pkey; Type: CONSTRAINT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".collect
    ADD CONSTRAINT collect_pkey PRIMARY KEY (id);


--
-- Name: good good_pkey; Type: CONSTRAINT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".good
    ADD CONSTRAINT good_pkey PRIMARY KEY (id);


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: goodsManage; Owner: postgres
--

ALTER TABLE ONLY "goodsManage".message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);


--
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- Name: blacklist blacklist_pkey; Type: CONSTRAINT; Schema: userManagement; Owner: postgres
--

ALTER TABLE ONLY "userManagement".blacklist
    ADD CONSTRAINT blacklist_pkey PRIMARY KEY (id);


--
-- Name: user user_login_key_unique; Type: CONSTRAINT; Schema: userManagement; Owner: postgres
--

ALTER TABLE ONLY "userManagement"."user"
    ADD CONSTRAINT user_login_key_unique UNIQUE (login_key);


--
-- Name: user user_openid_unique; Type: CONSTRAINT; Schema: userManagement; Owner: postgres
--

ALTER TABLE ONLY "userManagement"."user"
    ADD CONSTRAINT user_openid_unique UNIQUE (openid);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: userManagement; Owner: postgres
--

ALTER TABLE ONLY "userManagement"."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict qQCg2fsmquwXjMZeZdf6TtKJKKjba8P8aVQDdU8CIDq0EGMq5zKc8jSUa2EkZIU

