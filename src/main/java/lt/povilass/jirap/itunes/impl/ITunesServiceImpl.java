package lt.povilass.jirap.itunes.impl;


import com.atlassian.fugue.Pair;

import lt.povilass.jirap.itunes.ITunesService;
import lt.povilass.jirap.itunes.dto.ITunesArtistsDto;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Service
public class ITunesServiceImpl implements ITunesService {

    private static final Logger log = LoggerFactory.getLogger(ITunesServiceImpl.class);

    private static final String I_TUNES_URL = "http://itunes.apple.com/search";
    private static final Pair<String, String> ENTITY_PARAM = Pair.pair("entity", "allArtist");
    private static final String TERM_PARAM = "term";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ITunesServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public ITunesArtistsDto getArtistsFromITunes(String searchParam) throws IOException {

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(I_TUNES_URL)
                .queryParam(ENTITY_PARAM.left(), ENTITY_PARAM.right())
                .queryParam(TERM_PARAM, searchParam);

        ResponseEntity<String> response = restTemplate.getForEntity(builder.toUriString(), String.class);

        return objectMapper.readValue(response.getBody(), ITunesArtistsDto.class);
    }
}
